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
        email: 'devone@user.io',
        firstName: 'Devone',
        lastName: 'Userone',
        username: 'devone_userone',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 2,
        email: 'devtwo@user.io',
        firstName: 'Devtwo',
        lastName: 'Usertwo',
        username: 'devtwo_usertwo',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        id: 3,
        email: 'devthree@user.io',
        firstName: 'Devthree',
        lastName: 'Userthree',
        username: 'devthree_userthree',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['devone_userone', 'devtwo_usertwo', 'devthree_userthree'] }
    }, {});
  }
};