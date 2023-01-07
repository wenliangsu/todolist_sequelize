const express = require('express');
const router = express.Router();
const passport = require('passport');
// const bcrypt = require('bcryptjs');

//note 在migrations跟models設定完後才可使用
const db = require('../../models');
const User = db.User;

//Section router

//todo authenticate the user for login page
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

//todo check the userInfo at the register page
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  //verify if the fields are correct or not
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are written necessarily' });
    console.log(errors);
  }

  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirm password are different' });
    console.log(errors);
  }

  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        errors.push({ message: 'The user already existed' });
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword,
        });
      }

      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch((error) => console.log(error));
    })
    .catch((err) => console.log(err));
});

//todo user logout
router.get('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
  });
  req.flash('success_msg', 'You already logout successfully!!');
  res.redirect('/users/login');
});

module.exports = router;
