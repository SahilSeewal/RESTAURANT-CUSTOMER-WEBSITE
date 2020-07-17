const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const OrderSchema = new Schema({
  RestaurantName: String,
  Restaurantemail: String,
  custFirstName:String,
  custLastName:String,
  Guestemail: String,
  dish: String,
  rating:String,
  image: String,
  foodtype: String,
  price: String,
  lineOne: String,
  lineTwo: String,
  city: String,
  state: String,
  zip: String

});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
