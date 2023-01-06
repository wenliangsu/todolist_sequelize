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
app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true,
  })
    .then((todos) => {
      // console.log(todos);
      return res.render('index', { todos: todos });
    })
    .catch((error) => {
      return res.status(422).json(error);
    });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  return (
    Todo.findByPk(id)
      //note 將資料轉換成plain object的方式即使用 tableName.toJASON()
      .then((todo) => {
        //note 如果不轉成plain object的話，則物件的內容會很雜亂
        // console.log(todo);
        res.render('detail', { todo: todo.toJSON() });
      })
      .catch((error) => console.log(error))
  );
});

app.get('/users/login', (req, res) => {
  res.render('login');
});

app.post(
  '/users/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
);

app.get('/users/register', (req, res) => {
  res.render('register');
});

app.post('/users/register', (req, res) => {
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

app.get('/users/logout', (req, res) => {
  res.send('logout');
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
