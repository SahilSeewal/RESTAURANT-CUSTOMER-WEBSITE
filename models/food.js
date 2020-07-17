const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const FoodSchema = new Schema({
  RestaurantName: String,
  email: String,
  address: {
    lineOne: String,
    lineTwo: String,
    city: String,
    state: String,
    zip: String,
  },
  dish: String,
  rating:String,
  image: String,
  foodtype: String,
  price: String
});


const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
