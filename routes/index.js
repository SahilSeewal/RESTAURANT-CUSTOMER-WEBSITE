const express = require('express');
const router  = express.Router();

// Require Controller
const indexController = require('../controllers/index');

// Index
router.get('/', indexController.index);
router.get('/amILoggedIn', indexController.amILoggedIn);
router.get('/logout', indexController.getLogout);
router.get('/foodfilter',indexController.foodfilter)
router.get('/foodInfo/:id',indexController.foodInfo)

// Require all routes in the routes/<subdir>/ directory
router.use('/guest', require('./guest/guest'));
router.use('/restaurant', require('./restaurant/restaurant'));

module.exports = router;
