const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Schema   = mongoose.Schema;

const RestaurantSchema = new Schema({
  localStrategy: {
    email: String,
    password: String,
  },
  RestaurantName: String,
  address: {
    lineOne: String,
    lineTwo: String,
    city: String,
    state: String,
    zip: String,
  },
  userGroup: String,
});

// Generate hash for passwords
RestaurantSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if login password is valid
RestaurantSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.localStrategy.password);
};

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
module.exports = Restaurant;
