const bcrypt = require('bcryptjs');
const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');
const {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
} = require('../utils/validators');

const SORTABLE_USER_FIELDS = ['name', 'email', 'address', 'role'];
const SORTABLE_STORE_FIELDS = ['name', 'email', 'address', 'rating'];

function parseSort(field, allowed, fallback) {
  const sortField = allowed.includes(field) ? field : fallback;
  return sortField;
}

function parseOrder(order) {
  return String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
}

// Dashboard: total users, total stores, total ratings.
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load dashboard.', error: err.message });
  }
};

// Admin can add new stores, normal users, and admin users.
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const allowedRoles = ['ADMIN', 'NORMAL_USER', 'STORE_OWNER'];

    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const addressErr = validateAddress(address);
    const passwordErr = validatePassword(password);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (addressErr) errors.address = addressErr;
    if (passwordErr) errors.password = passwordErr;
    if (!role || !allowedRoles.includes(role)) {
      errors.role = 'Role must be one of ADMIN, NORMAL_USER, or STORE_OWNER.';
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role });

    return res.status(201).json({
      message: 'User created successfully.',
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create user.', error: err.message });
  }
};

// Admin can add new stores. Optionally assign an existing STORE_OWNER user as the owner.
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const addressErr = validateAddress(address);
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (addressErr) errors.address = addressErr;
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A store with this email already exists.' });
    }

    let owner = null;
    if (ownerId) {
      owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'ownerId must reference an existing user with the STORE_OWNER role.' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: owner ? owner.id : null });

    return res.status(201).json({
      message: 'Store created successfully.',
      store,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create store.', error: err.message });
  }
};

// Admin: list stores with Name, Email, Address, Rating; supports filters and sorting.
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: [
        'id', 'name', 'email', 'address',
        [fn('COALESCE', fn('AVG', col('ratings.rating')), 0), 'rating'],
      ],
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      subQuery: false,
    });

    let plain = stores.map((s) => {
      const p = s.get({ plain: true });
      p.rating = p.rating !== null ? parseFloat(p.rating).toFixed(2) : '0.00';
      return p;
    });

    const sortField = parseSort(sortBy, SORTABLE_STORE_FIELDS, 'name');
    const sortOrder = parseOrder(order);
    plain.sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === 'rating') {
        av = parseFloat(av);
        bv = parseFloat(bv);
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortOrder === 'ASC' ? -1 : 1;
      if (av > bv) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

    return res.json({ stores: plain });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stores.', error: err.message });
  }
};

// Admin: list normal and admin users with Name, Email, Address, Role; supports filters and sorting.
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const sortField = parseSort(sortBy, SORTABLE_USER_FIELDS, 'name');
    const sortOrder = parseOrder(order);

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      order: [[sortField, sortOrder]],
    });

    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users.', error: err.message });
  }
};

// Admin: view details of a single user (Name, Email, Address, Role).
// If the user is a Store Owner, their store's Rating should also be displayed.
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const result = user.get({ plain: true });

    if (user.role === 'STORE_OWNER') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const avg = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[fn('COALESCE', fn('AVG', col('rating')), 0), 'avgRating']],
          raw: true,
        });
        result.rating = avg && avg.avgRating !== null ? parseFloat(avg.avgRating).toFixed(2) : '0.00';
      } else {
        result.rating = null;
      }
    }

    return res.json({ user: result });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user details.', error: err.message });
  }
};
