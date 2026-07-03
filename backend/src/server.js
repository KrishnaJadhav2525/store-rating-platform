require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const seedAdmin = require('./utils/seedAdmin');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Creates tables if they do not already exist (safe for first run / dev use).
    await sequelize.sync();
    console.log('Database synced.');

    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
