const LocalStrategy = require('passport-local').Strategy;
const Guest         = require('../models/guest');
const Restaurant      = require('../models/restaurant');

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

module.exports = function(passport) {

  passport.serializeUser(function (userObject, done) {
    // userObject could be a Guest or a Resident... eventually maybe an Admin also
    let userGroup = "guest"; // Default value, could be anything
    let userPrototype =  Object.getPrototypeOf(userObject);
    if (userPrototype === Guest.prototype) {
        userGroup = "guest";
    } else if (userPrototype === Restaurant.prototype) {
        userGroup = "restaurant";
    } 
    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
    done(null,sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {
    if (sessionConstructor.userGroup == 'guest') {
      Guest.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    } else if (sessionConstructor.userGroup == 'restaurant') {
      Restaurant.findOne({
          _id: sessionConstructor.userId
      }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
          done(err, user);
      });
    } 
  });


  // LOCAL-GUEST-SIGNUP STRATEGY
  passport.use('local-guest-signup', new LocalStrategy({
      // By default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true, // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
      
      // asynchronous
      // Guest.findOne wont fire unless data is sent back
      process.nextTick(function() {

      Guest.findOne({ 'localStrategy.email' :  email }, function(err, guest) {

        // Return error on error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (guest) {
          return done(null, false, req.flash('guestSignupFailureMessage', 'That email is already taken.'));
        } else {
          // Create guest if email does not exist
          let newGuest = new Guest();

          // Local Credentials
          newGuest.localStrategy.email = email;
          newGuest.localStrategy.password = newGuest.generateHash(password);
          newGuest.firstName = req.body.first_name;
          newGuest.lastName = req.body.last_name;
          newGuest.address.lineOne = req.body.address_line_1;
          newGuest.address.lineTwo = req.body.address_line_2;
          newGuest.address.city = req.body.city;
          newGuest.address.state = req.body.state;
          newGuest.address.zip = req.body.zip_code;
          newGuest.userGroup = "Guest";


          // save the guest
          newGuest.save(function(err) {
            if (err)
              throw err;
            return done(null, newGuest, req.flash('guestSignupSuccessMessage', 'Success!'));
          });
        }
      })
      })
    }
  )); //END LOCAL-GUEST-SIGNUP

  // LOCAL-GUEST-LOGIN STRATEGY
  passport.use('local-guest-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
  
    function(req, email, password, done) {
      Guest.findOne({ 'localStrategy.email': email}, function(err, guest) {
        
        if (err)
          return done(err);
        
        if (!guest) {
          return done(null, false, req.flash('noGuestEmailFoundOnLogin', 'Email does not exist!'));
        }

        if (!guest.validPassword(password))
          return done(null, false, req.flash('incorrectGuestPassword', 'Oops! Wrong password.'));

        return done(null, guest);
        
      })
    }
  )); //END LOCAL-GUEST-LOGIN

  // LOCAL-RESIDENT-SIGNUP STRATEGY
  passport.use('local-restaurant-signup', new LocalStrategy({
      // By default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },

    function(req, email, password, done) {

      // asynchronous
      // Resident.findOne wont fire unless data is sent back
      process.nextTick(function() {

        Restaurant.findOne({ 'localStrategy.email': email }, function(err, restaurant) {

        if (err)
          return done(err);

        if (restaurant) {
          return done(null, false, req.flash('residentSignupFailureMessage', 'That email is already taken.'));
        } else {

          let newRestaurant = new Restaurant();

          newRestaurant.localStrategy.email = email;
          newRestaurant.localStrategy.password = newRestaurant.generateHash(password);
          newRestaurant.RestaurantName = req.body.first_name;
          newRestaurant.address.lineOne = req.body.address_line_1;
          newRestaurant.address.lineTwo = req.body.address_line_2;
          newRestaurant.address.city = req.body.city;
          newRestaurant.address.state = req.body.state;
          newRestaurant.address.zip = req.body.zip_code;
          newRestaurant.userGroup = "Restaurant";

          // save the resident
          newRestaurant.save(function(err) {
            if (err)
              throw err;
            return done(null, newRestaurant, req.flash('residentSignupSuccessMessage', 'Success!'));
          });
        }
      })
      })
    }
  )); // END LOCAL-RESIDENT-SIGNUP

  // LOCAL-RESIDENT-LOGIN STRATEGY
  passport.use('local-restaurant-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done) {
    Restaurant.findOne({ 'localStrategy.email': email}, function(err, restaurant) {
      
      if (err)
        return done(err);
      
      if (!restaurant) {
        return done(null, false, req.flash('noResidentEmailFoundOnLogin', 'Email does not exist!'));
      }

      if (!restaurant.validPassword(password))
        return done(null, false, req.flash('incorrectResidentPassword', 'Oops! Wrong password.'));

      return done(null, restaurant);
      
    })
  }
)); //END LOCAL-RESIDENT-LOGIN
}
