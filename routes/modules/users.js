const express = require('express');
const router = express.Router();
const passport = require('passport');

//note 在migrations跟models設定完後才可使用
const db = require('../../models');
const User = db.User;

//Section router
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      console.log('User already exists');
      return res.render('register', { name, email, password, confirmPassword });
    }

    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => User.create({ name, emil, password: hash }))
      .then(() => res._construct.redirect('/'))
      .catch((error) => console.log(error));
  });
});

router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
  });
  res.redirect('/users/login');
});

module.exports = router;
