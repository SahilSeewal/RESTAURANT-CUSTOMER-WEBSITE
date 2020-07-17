// For routes that we do want only guests or restaurants to enter, and 
// you do need to be a certain user for access.
function isGuest(req, res, next) {
  if (!req.user || !(req.user.userGroup === 'Guest')) {
req.flash("notguest","You are not logged in as Guest !")
    res.redirect('/');
    return
  }
  next();
}

function isRestaurant(req, res, next) {
  if (!req.user || !(req.user.userGroup === 'Restaurant')) {
    req.flash("notrestaurant","You are not logged in as Restaurant !")
    res.redirect('/');
    return
  }
  
  next();
}

// For routes that we do not want guests or residents to enter, but you also
// do not need to be a certain user for access.
function isNotLoggedIn(req, res, next) {
  if (req.user) {
    req.flash('doNotAllowSignUp', 'You cannot do that while logged in.')
    res.redirect('back');
    return
  }
  next();
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  }
  req.flash('doNotAllowAddFood', 'You have to do login first.')
  res.redirect('/');
  return
}


module.exports = {
  // isLoggedIn: isLoggedIn,
  isNotLoggedIn: isNotLoggedIn,
  isLoggedIn: isLoggedIn,
  isGuest: isGuest,
  // isNotGuest: isNotGuest,
  isRestaurant: isRestaurant,
  // isNotResident: isNotResident
}
