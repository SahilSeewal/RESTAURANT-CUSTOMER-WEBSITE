const express = require('express');
const Food = require("../models/food")

function index(req, res) {
  Food.find({},function(err, food){
    res.render('pages/index', { 
      // Available View Template Variables
      userExists: req.user, 
      doNotAllowSignUp: req.flash('doNotAllowSignUp'),
      doNotAllowAddFood: req.flash('doNotAllowAddFood'),
      notguest:req.flash("notguest"),
      notrestaurant:req.flash("notrestaurant"),
      food:food
    });
  })}

  function foodfilter(req,res){
    if(req.query.foodtype == "Both"){
    Food.find({},function(err, food){
      res.render("pages/index"
        ,{userExists: req.user, 
      doNotAllowSignUp: req.flash('doNotAllowSignUp'),
      doNotAllowAddFood: req.flash('doNotAllowAddFood'),
      notguest: req.flash('notguest'),
      notrestaurant: req.flash('notrestaurant'),
      food:food})

    })
  }
  if(req.query.foodtype == "Veg"){
    Food.find({"foodtype":"Veg"},function(err, food){
      res.render("pages/index"
        ,{userExists: req.user, 
      doNotAllowSignUp: req.flash('doNotAllowSignUp'),
      doNotAllowAddFood: req.flash('doNotAllowAddFood'),
      notguest: req.flash('notguest'),
      notrestaurant: req.flash('notrestaurant'),
      food:food})

    })
  }
  if(req.query.foodtype == "Non Veg"){
    Food.find({"foodtype":"Non Veg"},function(err, food){
      res.render("pages/index"
        ,{userExists: req.user, 
      doNotAllowSignUp: req.flash('doNotAllowSignUp'),
      doNotAllowAddFood: req.flash('doNotAllowAddFood'),
      notguest: req.flash('notguest'),
      notrestaurant: req.flash('notrestaurant'),
      food:food})

    })
  }
  }
  
function foodInfo(req, res){
Food.findOne({_id:req.params.id},function(err, food){
  res.render('pages/foodinfo',{
    userExists:req.user,
    food:food
  })
})
}

function amILoggedIn(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.send('NOT Logged in!');
  }
}

function getLogout(req, res) {
  req.session.destroy(function (err) {
    res.clearCookie('connect.sid');
    res.redirect('/'); 
  });
}

module.exports = {
  index: index,
  amILoggedIn: amILoggedIn,
  getLogout: getLogout,
  foodfilter: foodfilter,
  foodInfo: foodInfo
}
