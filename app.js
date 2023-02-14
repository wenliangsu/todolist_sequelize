const express = require('express');
const session = require('express-session');

const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// passport 變數設定寫在session之後
const usePassport = require('./config/passport');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT;

// Section middleware
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// passport寫在路由之前
usePassport(app);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  // set the success and warning message
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next();
});

app.use(routes);

// Section server listening
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
