'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        id: 1,
        ownerId: 1,
        address: "123 Peachtree Street",
        city: "Atlanta",
        state: "Georgia",
        country: "United States of America",
        lat: 33.7490,
        lng: -84.3880,
        name: "Atlanta Tech Hub",
        description: "Modern development space in downtown Atlanta",
        price: 123
      },
      {
        id: 2,
        ownerId: 1,
        address: "456 Tech Drive",
        city: "Savannah",
        state: "Georgia",
        country: "United States of America",
        lat: 32.0835,
        lng: -81.0998,
        name: "Savannah Code Space",
        description: "Historic tech workspace in beautiful Savannah",
        price: 200
      },
      {
        id: 3,
        ownerId: 2,
        address: "789 Innovation Way",
        city: "Augusta",
        state: "Georgia",
        country: "United States of America",
        lat: 33.4735,
        lng: -82.0105,
        name: "Augusta Innovation Center",
        description: "Collaborative workspace perfect for development teams",
        price: 350
      },
      {
        id: 4,
        ownerId: 2,
        address: "321 Code Lane",
        city: "Columbus",
        state: "Georgia",
        country: "United States of America",
        lat: 32.4609,
        lng: -84.9877,
        name: "Columbus Developer Studio",
        description: "Modern coding facility with state-of-the-art equipment",
        price: 175
      },
      {
        id: 5,
        ownerId: 3,
        address: "654 Developer Street",
        city: "Macon",
        state: "Georgia",
        country: "United States of America",
        lat: 32.8407,
        lng: -83.6324,
        name: "Macon Creative Labs",
        description: "Creative development space in central Georgia",
        price: 140
      },
      {
        id: 6,
        ownerId: 3,
        address: "987 Programming Plaza",
        city: "Athens",
        state: "Georgia",
        country: "United States of America",
        lat: 33.9519,
        lng: -83.3576,
        name: "Athens Tech Collective",
        description: "University town development hub with great amenities",
        price: 275
      },
      {
        id: 7,
        ownerId: 1,
        address: "147 Software Circle",
        city: "Albany",
        state: "Georgia",
        country: "United States of America",
        lat: 31.5804,
        lng: -84.1557,
        name: "Albany Digital Workspace",
        description: "Professional development workspace in southwest Georgia",
        price: 190
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};