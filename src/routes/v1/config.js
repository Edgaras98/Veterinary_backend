require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  dbConfig: {
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASS,
    port: process.env.SQLPORT,
    database: process.env.DB,
  },
};
