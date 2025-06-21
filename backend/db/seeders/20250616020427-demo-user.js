'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        id: 1,
        email: 'demo@user.io',
        firstName: 'Tiff',
        lastName: 'Lyon',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 2,
        email: 'user1@user.io',
        firstName: 'Adrian',
        lastName: 'Hirsch',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        id: 3,
        email: 'user2@user.io',
        firstName: 'Riley',
        lastName: 'Treat',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};