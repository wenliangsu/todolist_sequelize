'use strict';
const bcrypt = require('bcryptjs');
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678',
};

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    //note queryInterface.bulkInsert的用法有四個參數bulkInsert(tableName:string, record: Array, options: object, attributes: object)
    return queryInterface
      .bulkInsert(
        'Users',
        [
          {
            name: SEED_USER.name,
            email: SEED_USER.email,
            //note hashSync為bcrypt.hash的同步版本(套件多半會提供同步與非同步版本)
            password: bcrypt.hashSync(
              SEED_USER.password,
              bcrypt.genSaltSync(10),
              null
            ),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      .then((userId) =>
        queryInterface.bulkInsert(
          'Todos',
          Array.from({ length: 10 }).map((_, i) => ({
            name: `name-${i}`,
            USerId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          {}
        )
      );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    //note queryInterface.bulkDelete的用法有四個參數bulkDelete(tableName:string, where: object, options: object, model: Model)
    return queryInterface
      .bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}));
  },
};
