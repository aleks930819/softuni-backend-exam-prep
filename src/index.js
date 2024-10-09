require('dotenv').config();

require('./@typedef/typedefs');

// Global imports
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

// Local imports
const { auth } = require('./middlewares/auth');
const connectDB = require('./config/db');
const { PORT } = require('./constants/config');
const logger = require('./utils/logger');
const routes = require('./router');

// Init
const app = express();

// Config
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// View engine
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

// Database
connectDB();

// Middleware
app.use(auth);

// Routes
app.use(routes);

// Listen
app.listen(PORT, () => {
  logger.log(`Server is running on port ${PORT}`);
});
