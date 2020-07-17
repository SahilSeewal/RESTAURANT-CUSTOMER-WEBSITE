const express = require('express');
const passport = require('passport');
const Restaurant = require('../../models/restaurant');
const Food = require('../../models/food');
const Order = require('../../models/order');

// Restaurant Index (Dashboard) Controller
function index(req, res) {
Food.find({"email":req.user.localStrategy.email},function(err, food){
 res.render('pages/restaurant/dashboard', { 
  userExists:req.user, 
  residentSignupMessage: req.flash('residentSignupSuccessMessage'),
  restaurantEmail: req.user.localStrategy.email,
  restaurantName: req.user.RestaurantName,
  restaurantAddressLineOne: req.user.address.lineOne,
  restaurantAddressLineTwo: req.user.address.lineTwo,
  restaurantCity: req.user.address.city,
  restaurantState: req.user.address.state,
  restaurantZipCode: req.user.address.zip,
  food: food,
  dishadded:req.flash('dishadded'),
  removeDishSuccess:req.flash("removeDishSuccess")
});
})
}

// GET Restaurant Registration Page
function getSignup(req, res) {
  console.log(req.flash('residentSignupFailureMessage'))
  res.render('pages/restaurant/signup', {
    residentSignupMessage: req.flash('residentSignupFailureMessage'),
  });
}

// Handle Restaurant Registration POST Request
function postSignup(req, res, next) {
  passport.authenticate('local-restaurant-signup', {
    successRedirect : '/restaurant/',
    failureRedirect : '/restaurant/signup',
    failureFlash : true
  })(req, res, next)
}

// GET Restaurant Login Page
function getLogin(req, res) {
  res.render('pages/restaurant/login', { 
    noResidentEmailFoundOnLogin: req.flash('noResidentEmailFoundOnLogin'),
    incorrectResidentPassword: req.flash('incorrectResidentPassword')
  });
}

// Handle Restaurant Login POST Request
function postLogin(req, res, next) {
  passport.authenticate('local-restaurant-login', {
    successRedirect: '/restaurant/',
    failureRedirect: '/restaurant/login',
    failureFlash: true
  })(req, res, next);
}

function getUser(req, res) {
  res.send(req.user);
}

function getAddFood(req, res){
res.render("pages/restaurant/add_food",{userExists:req.user})  
}

function postAddFood(req, res){
let newFood = new Food()

newFood.RestaurantName =  req.user.RestaurantName
newFood.email =  req.user.localStrategy.email
newFood.address.lineOne = req.user.address.lineOne
newFood.address.lineTwo = req.user.address.lineTwo
newFood.address.city = req.user.address.city
newFood.address.state = req.user.address.state
newFood.address.zip = req.user.address.zip
newFood.dish = req.body.dish
newFood.image = req.body.image
newFood.rating = req.body.rating
newFood.foodtype = req.body.foodtype
newFood.price = req.body.price
newFood.save()
req.flash('dishadded',"Dish is successfully added !")
res.redirect('/restaurant')
}
  
//remove dish
function removeDish(req, res){
Food.findOneAndDelete({"_id": req.params.id}, function(err, data){
  if(!err){
    Food.find({"email":req.user.localStrategy.email},function(err, food){
      res.render('pages/restaurant/dashboard', { 
       userExists:req.user, 
       residentSignupMessage: req.flash('residentSignupSuccessMessage'),
       restaurantEmail: req.user.localStrategy.email,
       restaurantName: req.user.RestaurantName,
       restaurantAddressLineOne: req.user.address.lineOne,
       restaurantAddressLineTwo: req.user.address.lineTwo,
       restaurantCity: req.user.address.city,
       restaurantState: req.user.address.state,
       restaurantZipCode: req.user.address.zip,
       food: food,
       dishadded:req.flash('dishadded'),
       removeDishSuccess:req.flash("removeDishSuccess", "Dish is Successfully removed !")
     });
     })
   }
})
}

function orderedFood(req, res){
  Order.find({"Restaurantemail":req.user.localStrategy.email},function(err, order){
    res.render("pages/restaurant/orders",{
      order:order,
      userExists:req.user,
      restaurantName: req.user.RestaurantName
    })
  })
}
// Export Restaurant Controllers
module.exports = {
  index: index,
  getSignup: getSignup,
  postSignup: postSignup,
  getLogin: getLogin,
  postLogin: postLogin,
  getUser: getUser,
  getAddFood: getAddFood,
  postAddFood: postAddFood,
  removeDish: removeDish,
  orderedFood: orderedFood
}
