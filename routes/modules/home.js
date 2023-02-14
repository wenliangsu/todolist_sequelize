const express = require('express');
const router = express.Router();

const db = require('../../models');
const Todo = db.Todo;
const User = db.User;

// todo read all the data
// Thinking users先找出該user的id後，在去找出todos裡面的UserId，兩者比對後，顯現出資料
router.get('/', (req, res) => {
  const userId = req.user.id;
  User.findByPk(userId).then(user => {
    if (!user) {
      // note 無此user 則顯示錯誤訊息 ，此為固定用法
      throw new Error('User not found!');
    }

    return Todo.findAll({ where: { UserId: userId }, raw: true, nest: true })
      .then(todos => {
        return res.render('index', { todos });
      })
      .catch(error => {
        return res.status(422).json(error);
      });
  });
});

module.exports = router;
