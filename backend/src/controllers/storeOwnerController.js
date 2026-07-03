const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// Store Owner dashboard: list of users who rated their store, and the average rating.
exports.getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'No store is associated with this account.' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('COALESCE', fn('AVG', col('rating')), 0), 'avgRating']],
      raw: true,
    });
    const averageRating = avgResult && avgResult.avgRating !== null
      ? parseFloat(avgResult.avgRating).toFixed(2)
      : '0.00';

    return res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
        rating: r.rating,
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load dashboard.', error: err.message });
  }
};
