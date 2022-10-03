const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Не заполнен name'],
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Не заполнен e-mail'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Не заполнен password'],
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
