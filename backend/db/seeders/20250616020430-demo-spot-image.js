'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'http://localhost:5173/workspace1.jpg',
        preview: true,

      },
      {
        spotId: 1,
        url: 'http://localhost:5173/workspace2.jpg',
        preview: false,

      },
      {
        spotId: 1,
        url: 'http://localhost:5173/workspace3.jpg',
        preview: false,

      },
      {
        spotId: 1,
        url: 'http://localhost:5173/workspace4.jpg',
        preview: false,

      },      
      {
        spotId: 1,
        url: 'http://localhost:5173/workspace5.JPG',
        preview: false,

      },
      {
        spotId: 2,
        url: 'http://localhost:5173/workspace6.JPG',
        preview: true,

      },
      {
        spotId: 2,
        url: 'http://localhost:5173/workspace15.JPG',
        preview: false,

      },
      {
        spotId: 2,
        url: 'http://localhost:5173/workspace16.JPG',
        preview: false,

      },
      {
        spotId: 2,
        url: 'http://localhost:5173/workspace17.JPG',
        preview: false,

      },
      {
        spotId: 2,
        url: 'http://localhost:5173/workspace18.JPG',
        preview: false,

      },
      {
        spotId: 3,
        url: 'http://localhost:5173/workspace7.JPG',
        preview: true,
      },
      {
        spotId: 3,
        url: 'http://localhost:5173/workspace1.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'http://localhost:5173/workspace2.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'http://localhost:5173/workspace3.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'http://localhost:5173/workspace4.jpg',
        preview: false,
      },
      {
        spotId: 4,
        url: 'http://localhost:5173/workspace8.JPG',
        preview: true,
      },
      {
        spotId: 4,
        url: 'http://localhost:5173/workspace5.JPG',
        preview: false,
      },
      {
        spotId: 4,
        url: 'http://localhost:5173/workspace6.JPG',
        preview: false,
      },
      {
        spotId: 4,
        url: 'http://localhost:5173/workspace7.JPG',
        preview: false,
      },
      {
        spotId: 4,
        url: 'http://localhost:5173/workspace8.JPG',
        preview: false,
      },
      {
        spotId: 5,
        url: 'http://localhost:5173/workspace9.JPG',
        preview: true,
      },
      {
        spotId: 5,
        url: 'http://localhost:5173/workspace9.JPG',
        preview: false,
      },
      {
        spotId: 5,
        url: 'http://localhost:5173/workspace10.JPG',
        preview: false,
      },
      {
        spotId: 5,
        url: 'http://localhost:5173/workspace11.JPG',
        preview: false,
      },
      {
        spotId: 5,
        url: 'http://localhost:5173/workspace12.JPG',
        preview: false,
      },
      {
        spotId: 6,
        url: 'http://localhost:5173/workspace10.JPG',
        preview: true,
      },
      {
        spotId: 6,
        url: 'http://localhost:5173/workspace13.JPG',
        preview: false,
      },
      {
        spotId: 6,
        url: 'http://localhost:5173/workspace14.JPG',
        preview: false,
      },
      {
        spotId: 6,
        url: 'http://localhost:5173/workspace1.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'http://localhost:5173/workspace2.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'http://localhost:5173/workspace11.JPG',
        preview: true,
      },
      {
        spotId: 7,
        url: 'http://localhost:5173/workspace3.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'http://localhost:5173/workspace4.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'http://localhost:5173/workspace5.JPG',
        preview: false,
      },
      {
        spotId: 7,
        url: 'http://localhost:5173/workspace6.JPG',
        preview: false,
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};