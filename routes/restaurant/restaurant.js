const express = require('express');
const router  = express.Router();

// All request callbacks are handled in this controller file
const restaurantController = require('../../controllers/restaurant/restaurant');

// Route Protection
const ensureUser = require('../../middlewares/routeAuthentication');

// Public Restaurant Routes
router.get('/signup', ensureUser.isNotLoggedIn, restaurantController.getSignup);
router.post('/signup', ensureUser.isNotLoggedIn, restaurantController.postSignup);
router.get('/login', ensureUser.isNotLoggedIn, restaurantController.getLogin);
router.post('/login', ensureUser.isNotLoggedIn, restaurantController.postLogin);

// Protected Restaurant Routes
router.get('/', ensureUser.isRestaurant, restaurantController.index);
router.get('/user', ensureUser.isRestaurant, restaurantController.getUser);
router.get('/addFood', ensureUser.isLoggedIn, ensureUser.isRestaurant, restaurantController.getAddFood);
router.post('/addFood', ensureUser.isLoggedIn, ensureUser.isRestaurant, restaurantController.postAddFood);
router.post('/removeDish/:id', ensureUser.isRestaurant, restaurantController.removeDish);
router.get('/orderedFood',ensureUser.isRestaurant, restaurantController.orderedFood);

module.exports = router;
