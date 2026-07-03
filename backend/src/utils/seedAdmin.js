const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Ensures at least one System Administrator account exists so the platform
// can be accessed initially (the assignment requires a single login system
// where an admin adds all other users, so one admin must pre-exist).
async function seedAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL;
  if (!email) return;

  const existing = await User.findOne({ where: { email } });
  if (existing) return;

  const hashed = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
  await User.create({
    name: process.env.DEFAULT_ADMIN_NAME,
    email,
    password: hashed,
    address: process.env.DEFAULT_ADMIN_ADDRESS,
    role: 'ADMIN',
  });
  console.log(`Default admin account created: ${email}`);
}

module.exports = seedAdmin;
