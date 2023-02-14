const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
//note mongoose 這邊的導入User model方式和sequelize不同
const db = require('../models');
const User = db.User;

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      //notice req要可以納入下面的話，需要多上面寫個passReqToCallback才可以使用，否則會變成done不是個function(請看passport官方文件)
      (req, email, password, done) => {
        User.findOne({ where: { email } })
          .then((user) => {
            if (!user) {
              req.flash('warning_msg', 'This email is not registered');
              return done(null, false, {
                message: 'That email is not registered!',
              });
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                req.flash('warning_msg', 'Email or password is incorrect.');
                return done(null, false, {
                  message: 'Email or Password incorrect.',
                });
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );

  //!! fb登入驗證部分 node.js的版本要用16會叫好，其他版本報錯
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
      },
      function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json;
        User.findOne({ where: { email } }).then((user) => {
          if (user) return done(null, user);

          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
  );

  //Serialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
   deserialize
  passport.deserializeUser((id, done) => {
    //note 此段和mongoose寫法不同，須將user的物件轉成plain object
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON();
        done(null, user);
      })
      .catch((err) => done(err, null));
  });
};
