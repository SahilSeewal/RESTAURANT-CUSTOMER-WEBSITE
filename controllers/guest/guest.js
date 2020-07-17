const express = require('express');
const passport = require('passport');
const Guest = require('../../models/guest');
const Order = require('../../models/order');
const Food = require('../../models/food');
const { startSession } = require('mongoose');
// Guest Index (Dashboard) Controller
function index(req, res) {
Order.find({"Guestemail":req.user.localStrategy.email},function(err, order){
  res.render('pages/guest/dashboard', { 
    guestSignupMessage: req.flash('guestSignupSuccessMessage'),
    guestEmail: req.user.localStrategy.email,
    guestFirstName: req.user.firstName,
    guestLastName: req.user.lastName,
    guestAddressLineOne: req.user.address.lineOne,
    guestAddressLineTwo: req.user.address.lineTwo,
    guestCity: req.user.address.city,
    guestState: req.user.address.state,
    guestZipCode: req.user.address.zip,
    userExists: req.user,
    order:order
  });
})
 
}

// GET Guest Registration Page
function getSignup(req, res) {
  res.render('pages/guest/signup', { 
    guestSignupMessage: req.flash('guestSignupFailureMessage'),
  });
}

// Handle Guest Registration POST Request
function postSignup(req, res, next) {
  passport.authenticate('local-guest-signup', {
    successRedirect : '/guest/',
    failureRedirect : '/guest/signup',
    failureFlash : true
  })(req, res, next) // immediately invoke passport.authenticate
}

// GET Guest Login Page
function getLogin(req, res) {
  res.render('pages/guest/login', { 
    noGuestEmailFoundOnLogin: req.flash('noGuestEmailFoundOnLogin'),
    incorrectGuestPassword: req.flash('incorrectGuestPassword')
  });
}

// Handle Guest Login POST Request
function postLogin(req, res, next) {
  passport.authenticate('local-guest-login', {
    successRedirect: '/guest/',
    failureRedirect: '/guest/login',
    failureFlash: true
  })(req, res, next);
}

function getUser(req, res) {
  res.send(req.user);
}


function orderNow(req, res){
  Food.findOne({"_id":req.params.id},function(err, food){
if(!err){
  Order.create({
    RestaurantName: food.RestaurantName,
    Restaurantemail: food.email,
    Guestemail: req.user.localStrategy.email,
    dish: food.dish,
    rating:food.rating,
    image: food.image,
    foodtype: food.foodtype,
    price: food.price,
    custFirstName:req.user.firstName,
    custLastName:req.user.lastName,
     lineOne: req.user.address.lineOne,
      lineTwo: req.user.address.lineTwo,
      city: req.user.address.city,
      state: req.user.address.state,
      zip: req.user.address.zip
    
  },function(err, data){
  })}
else{
  console.log(err)}
})
  res.render("pages/guest/booked")
}

// Export Guest Controllers
module.exports = {
  index: index,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogin: getLogin,
  postLogin: postLogin,
  getUser: getUser,
  orderNow: orderNow,

}
