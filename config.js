const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, //  максимум 100 запросов с одного IP
});

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const HTTP_CREATE = 201;
const SALT_ROUNDS = 10;
const { JWT_SECRET = 'some_secret' } = process.env;
const MONGO_CONF = 'mongodb://localhost:27017/moviesdb';

module.exports = {
  DUBLICATE_MONGOOSE_ERROR_CODE,
  SALT_ROUNDS,
  JWT_SECRET,
  HTTP_CREATE,
  apiLimiter,
  MONGO_CONF,
};
