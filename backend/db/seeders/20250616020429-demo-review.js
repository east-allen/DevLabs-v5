'use strict';
const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        id: 1,
        spotId: 1,
        userId: 2,
        review: "Wonderful Alaskan get away in the woods, with moutain views.",
        stars: 5,
      },
      {
        id: 2,
        spotId: 2,
        userId: 3,
        review: "Can't beat walks in the vineyard with a glass of wine in hand!",
        stars: 5,
      },
      {
        id: 3,
        spotId: 3,
        userId: 1,
        review: "Perfect spot to attend a show at the closest venue!",
        stars: 5,
      },
      {
        id: 4,
        spotId: 5,
        userId: 2,
        review: "This place made all my childhood dreams of living in a treehouse come true! ",
        stars: 5,
      },
      {
        id: 5,
        spotId: 7,
        userId: 3,
        review: "So many lovely resturaunts near by!",
        stars: 4,
      },
      {
        id: 6,
        spotId: 1,
        userId: 3,
        review: "I booked this spot in the perfect time for fishing season. I caught my limit in only a few hours!",
        stars: 4,
      },
      {
        id: 7,
        spotId: 2,
        userId: 1,
        review: "Walking through the vines with my new favorite glass of wine was just what I needed!",
        stars: 5,
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 5, 7] }
    }, {});
  }
};