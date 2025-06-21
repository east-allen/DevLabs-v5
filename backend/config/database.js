require('dotenv').config();

module.exports = {
  development: {
    storage: process.env.DB_FILE || './db/dev.db',
    dialect: 'sqlite',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
