require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { apiLimiter } = require('./config');
const handleError = require('./middlewares/handleError');
const router = require('./routes/index');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, MONGO_URI = 'mongodb://localhost:27017/moviesdb' } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors);
app.use(requestLogger);
app.use(apiLimiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
