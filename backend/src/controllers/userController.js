const { Op, fn, col } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');
const { validateRating } = require('../utils/validators');

// Normal user: list all registered stores, searchable by Name and Address.
// Each row includes Store Name, Address, Overall Rating, and the user's own submitted rating.
exports.listStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: [
        'id', 'name', 'email', 'address',
        [fn('COALESCE', fn('AVG', col('ratings.rating')), 0), 'overallRating'],
      ],
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      subQuery: false,
      order: [['name', 'ASC']],
    });

    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { userId, storeId: storeIds },
      attributes: ['storeId', 'rating'],
      raw: true,
    });
    const myRatingMap = {};
    myRatings.forEach((r) => { myRatingMap[r.storeId] = r.rating; });

    const result = stores.map((s) => {
      const p = s.get({ plain: true });
      p.overallRating = p.overallRating !== null ? parseFloat(p.overallRating).toFixed(2) : '0.00';
      p.myRating = myRatingMap[p.id] || null;
      return p;
    });

    return res.json({ stores: result });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch stores.', error: err.message });
  }
};

// Normal user: submit a new rating (1-5) for a store, or modify an existing one.
exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const ratingErr = validateRating(rating);
    if (ratingErr) {
      return res.status(400).json({ message: 'Validation failed.', errors: { rating: ratingErr } });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const [record, created] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: { rating: Number(rating) },
    });

    if (!created) {
      record.rating = Number(rating);
      await record.save();
    }

    return res.status(created ? 201 : 200).json({
      message: created ? 'Rating submitted successfully.' : 'Rating updated successfully.',
      rating: record,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit rating.', error: err.message });
  }
};
