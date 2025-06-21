'use strict';
const { Review } = require('../models');

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
        review: "Excellent development workspace in downtown Atlanta with great amenities.",
        stars: 5,
      },
      {
        id: 2,
        spotId: 2,
        userId: 3,
        review: "Perfect coding environment in historic Savannah, very inspiring!",
        stars: 5,
      },
      {
        id: 3,
        spotId: 3,
        userId: 1,
        review: "Great collaborative space in Augusta, perfect for team projects!",
        stars: 5,
      },
      {
        id: 4,
        spotId: 5,
        userId: 2,
        review: "Amazing development facility in Macon with excellent equipment!",
        stars: 5,
      },
      {
        id: 5,
        spotId: 7,
        userId: 3,
        review: "Fantastic workspace in Albany with great local tech community!",
        stars: 4,
      },
      {
        id: 6,
        spotId: 1,
        userId: 3,
        review: "Booked this Atlanta space for a hackathon - perfect setup and location!",
        stars: 4,
      },
      {
        id: 7,
        spotId: 2,
        userId: 1,
        review: "The Savannah workspace has such a creative atmosphere, boosted my productivity!",
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