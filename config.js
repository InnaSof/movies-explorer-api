const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, //  максимум 100 запросов с одного IP
});

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const HTTP_CREATE = 201;
const SALT_ROUNDS = 10;
// const { JWT_SECRET } = process.env;

const JWT_SECRET = 'g+2r_1b)4((0st81-r&g8ugs7-i!c4*$s@ll=*(ev#y%ivek6n';

module.exports = {
  DUBLICATE_MONGOOSE_ERROR_CODE,
  SALT_ROUNDS,
  JWT_SECRET,
  HTTP_CREATE,
  apiLimiter,
};
