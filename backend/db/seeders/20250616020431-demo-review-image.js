'use strict';
const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://i.imgur.com/uhF7ktY.jpg',
      },
      {
        reviewId: 2,
        url: 'https://i.imgur.com/wk3KmeL.jpg',
      },
      {
        reviewId: 3,
        url: 'https://i.imgur.com/K6mMSDf.jpg',
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};