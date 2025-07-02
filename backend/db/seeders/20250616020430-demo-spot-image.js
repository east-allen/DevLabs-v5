'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://i.imgur.com/gJ78p5F.jpg',
        preview: true,

      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/VWikgi9.jpg',
        preview: false,

      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/NaVgP6f.jpg',
        preview: false,

      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/Z8np1tP.jpg',
        preview: false,

      },      
      {
        spotId: 1,
        url: 'https://i.imgur.com/DVhY5Z1.jpg',
        preview: false,

      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/v0pdgma.jpg',
        preview: true,

      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/iMrvVLb.jpg',
        preview: false,

      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/gJ78p5F.jpg',
        preview: false,

      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/VWikgi9.jpg',
        preview: false,

      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/NaVgP6f.jpg',
        preview: false,

      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/hQoW0R6.jpg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/gJ78p5F.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/VWikgi9.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/NaVgP6f.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/Z8np1tP.jpg',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/HhX7WJw.jpg',
        preview: true,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/DVhY5Z1.jpg',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/v0pdgma.jpg',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/hQoW0R6.jpg',
        preview: false,
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/HhX7WJw.jpg',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/lSe43am.jpg',
        preview: true,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/lSe43am.jpg',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/StfRd76.jpg',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/QtfeEO9.jpg',
        preview: false,
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/uhF7ktY.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/StfRd76.jpg',
        preview: true,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/wk3KmeL.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/K6mMSDf.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/gJ78p5F.jpg',
        preview: false,
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/VWikgi9.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/QtfeEO9.jpg',
        preview: true,
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/NaVgP6f.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/Z8np1tP.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/DVhY5Z1.jpg',
        preview: false,
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/v0pdgma.jpg',
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
