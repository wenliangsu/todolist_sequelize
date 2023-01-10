const express = require('express');
const router = express.Router();

//note 在migrations跟models設定完後才可使用
const db = require('../../models');
const Todo = db.Todo;

// Thinking 原先未關聯之前使用findByPk(id)，如此只會找到todo list的id，但是不知道使用者是誰，所以透過findOne並搭配where語法，找出兩者的交集後，顯現資料
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const UserId = req.user.id;

  return (
    Todo.findOne({ where: { id, UserId } })
      //note 將資料轉換成plain object的方式即使用 tableName.toJASON()
      .then((todo) => {
        //note 如果不轉成plain object的話，則物件的內容會很雜亂
        // console.log(todo);
        res.render('detail', { todo: todo.toJSON() });
      })
      .catch((error) => console.log(error))
  );
});

module.exports = router;
