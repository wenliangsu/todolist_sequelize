'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    // note 一個user有許多個todo
    User.hasMany(models.Todo);
  };
  return User;
};
