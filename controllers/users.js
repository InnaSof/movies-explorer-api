const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  DUBLICATE_MONGOOSE_ERROR_CODE,
  SALT_ROUNDS,
  JWT_SECRET,
  HTTP_CREATE,
} = require('../config');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(HTTP_CREATE).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
        next(new ConflictError('Такой e-mail уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Данные не верны!');
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Данные не верны!');
      }
      return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    })
    .then((token) => res.send({ token }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
        next(new ConflictError('Такой e-mail уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};
