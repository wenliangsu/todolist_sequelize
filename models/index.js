// !!說明請看Craft
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// 與資料庫連線
let sequelize;
if (config.use_env_variable) {
  // note 優先根據環境變數來決定連線資料庫的參數
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// 動態引入其他 models
// note fs = file system 為node內建的模組, 在models底下尋找.js結尾的檔案，偵測到後自動運用sequelize引入，例如User.js ==> db.User
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// 設定 Models 之間的關聯
// note 此段為掃描關聯的設定
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 匯出需要的物件
//note sequelize => 表示連線線資料庫的instance, Sequelize ==>存取Sequelize 這個class, 代表本身的函示庫
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
