'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2025-03-15',
        endDate: '2025-03-22',
     
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2025-04-10',
        endDate: '2025-04-17',
       
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2025-05-05',
        endDate: '2025-05-12',
       
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};