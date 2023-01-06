const express = require('express');
const router = express.Router();

//note 在migrations跟models設定完後才可使用
const db = require('../../models');
const Todo = db.Todo;

router.get('/:id', (req, res) => {
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

module.exports = router;
