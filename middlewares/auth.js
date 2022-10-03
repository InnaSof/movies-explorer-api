const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      next(new UnauthorizedError('Токен не найден!'));
      return;
    }
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        next(new UnauthorizedError('Токен не действителен!'));
        return;
      }
      if (payload) {
        req.user = payload;
        next();
      }
    });
  } else {
    next(new UnauthorizedError('Требуется авторизация!'));
  }
};
