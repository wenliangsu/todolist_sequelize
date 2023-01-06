const express = require('express');
const session = require('express-session');

const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
//passport 變數設定寫在session之後
const usePassport = require('./config/passport');
//臨時引用，所以先設定passport 的require
const passport = require('passport');

//note 在migrations跟models設定完後
const db = require('./models');
const Todo = db.Todo;
const User = db.User;

const routes = require('./routes');

const app = express();
const PORT = 3000;

//Section middleware
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
);

//passport寫在路由之前
usePassport(app);

//Section router

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
