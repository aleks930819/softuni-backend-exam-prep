const mongoose = require('mongoose');

const { DB_URL } = require('../constants/config');

const logger = require('../utils/logger');

async function connectDB() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.log('Database connected');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = connectDB;
