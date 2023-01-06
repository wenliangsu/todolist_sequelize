'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    'Todo',
    {
      name: DataTypes.STRING,
      isDone: DataTypes.BOOLEAN,
    },
    {}
  );
  Todo.associate = function (models) {
    // associations can be defined here
    //note 一個todo 只使用於一個user
    Todo.belongsTo(models.User);
  };
  return Todo;
};
