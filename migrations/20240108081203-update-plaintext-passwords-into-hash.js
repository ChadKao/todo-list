'use strict';
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll({ attributes: ['id', 'password'] })

    for (const user of users) {
      if (user.password.length < 60) {
        await user.update({ password: await bcrypt.hash(user.password, 10) });
      }
    }
  },

  async down (queryInterface, Sequelize) {

  }
};
