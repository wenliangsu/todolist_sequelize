# Todo-list for MySQL

![ScteenShot](/public/images/ScreenShot-1.png)
![ScteenShot](/public/images/ScreenShot-2.png)

## Introduction

Ths application can help people to list their work and check if they are finished or not.

## Feature

- Read all the list of todo
- Can create a lot of accounts and all of them are independently.
- Can create the new todo, edit or delete.
- Support the login of Facebook
- The database is used by MySQL

## Package environment

- Node.js@18.4.0
- Express @4.17.1
- Express-handleBars @4.0.4
- Express-session@1.17.1
- mysql2@2.1.0
- passport@0.4.0
- passport-facebook@3.0.0
- passport-local@1.0.0
- bcrypt.js@2.4.3
- method-override@3.0.0
- connect-flash@0.1.1
- dotenv@16.0.3
- sequelize@5.21.13
- sequelize-cli@5.51

## How to use

1. Confirm you have already install npm, node.js and express.
   <br />
2. Clone this repository.

   ```
   https://github.com/wenliangsu/todolist_sequelize.git
   ```

3. Make sure you already install the [MySQL](https://dev.mysql.com/downloads/mysql/) database and GUI of its [workbrench](https://dev.mysql.com/downloads/workbench/) in your computer.
   <br />
4. Install the package of sequelize.
   <br />

   ```
   npm install mysql2 sequelize sequelize-cli
   ```

5. Open the workbrench and execute the code as following to create the database.
   <br />

   ```
   drop database if exists Your_database_name;
   create database Your_database_name;
   use Your_database_name;
   ```

    <br />

6. Open the config.json file and change your database name.

   ```
     {
      	"development": {
      		"username": "root",
      		"password": "password",
      		"database": "database_name", // your database name
      		"host": "127.0.0.1",
      		"dialect": "mysql"
      	},

        ...

     }

   ```

   <br />

7. Run the command in your terminal to create the tables of todo and user.
   (If you want to create the table by your self, you have to edit the file in migrations folder. )
   <br />

   ```
   npx sequelize db:migrate
   ```

    <br />

8. Run the seeder for database. (if you have)
   ```
   npx sequelize db:seed:all
   ```
    <br />
9. You will see the message after start the server by `npm run start`, and copy the link into your browser.
   <br />
   ```
   App is running on http://localhost: 3000
   ```

 <br />
### Contributor

_Wen Su_
