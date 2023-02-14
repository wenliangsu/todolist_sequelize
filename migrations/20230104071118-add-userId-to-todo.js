'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    //! !此區塊完成後，需要到models裡面去撰寫關聯設定, todo.js and user.js
    // notice 不寫userId是因為在sequelize裡的關聯設置為 Model名稱 + Id，因此才會寫成UserId
    // note Model名稱都要加s，表示很多筆資料在裡面, 自己寫的時候不會加入，sequelize會自動加入，例如Todo -> Todos
    return queryInterface.addColumn('Todos', 'UserId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      // note 由於 user 一個對照多個todo，所以主鍵設在userId, 因此要把reference寫上去，才可以資料連動
      reference: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn('Todo', 'UserId');
  }
};
