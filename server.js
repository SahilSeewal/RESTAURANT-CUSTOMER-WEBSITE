// Require Modules
const path       = require('path');
const express    = require('express');
const session    = require('express-session');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const flash      = require('connect-flash');
const passport   = require('passport');

// Initialize Express
const app        = express();

// dotenv
require('dotenv').config({path: path.join(__dirname, ".env")});

// Pass Passport for configuration
require('./config/passport')(passport); 

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Bind application-level middleware to an instance of the app object
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// NOTE: Express app.get('env') returns 'development' if NODE_ENV is not defined.
if (app.get('env') === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Required for Passport:
app.use(session({ 
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  secret:"love country"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/multiple_auth_demo",{useNewUrlParser:true})
  .then(connection => {
      console.log(`Connected to MongoDB on port ${mongoose.connection.port}`)
  })
  .catch(error => {
    console.log(error.message)
  });

// Routes
app.use('/', require('./routes'));

// Server

const port = process.env.PORT || 3000; // CONFIRM: configure this to read from $PORT
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}/`);
});
