const express = require('express');
const router = express.Router();

//note 在migrations跟models設定完後才可使用
const db = require('../../models');
const Todo = db.Todo;
// todo Create
router.get('/new', (req, res) => {
  return res.render('new');
});

router.post('/', (req, res) => {
  const UserId = req.user.id;
  const name = req.body.name;
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
});

//todo Read
// Thinking 原先未關聯之前使用findByPk(id)，如此只會找到todo list的id，但是不知道使用者是誰，所以透過findOne並搭配where語法，找出兩者的交集後，顯現資料
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id;

  return (
    Todo.findOne({ where: { id, UserId } })
      //note 將資料轉換成plain object的方式即使用 tableName.toJASON()
      .then((todo) => {
        //note 如果不轉成plain object的話，則物件的內容會很雜亂
        res.render('detail', { todo: todo.toJSON() });
      })
      .catch((error) => console.log(error))
  );
});

// todo Update
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;

  return (
    Todo.findOne({ where: { id, UserId } })
      // note 利用get()來取得查詢的資料欄位裡面的所有value
      .then((todo) => res.render('edit', { todo: todo.get() }))
      .catch((error) => console.log(error))
  );
});

router.put('/:id', (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  const { name, isDone } = req.body;

  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => {
      todo.name = name;
      // note like the code of if statement
      todo.isDone = isDone === 'on';

      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});

// todo Delete
router.delete('/:id', (req, res) => {
  const UserId = req.user.id;
  const id = req.params.id;
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => todo.destroy())
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error));
});

module.exports = router;
