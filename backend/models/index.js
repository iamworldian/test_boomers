const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('test_boomershub', 'ashiq', '12345', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});





module.exports = sequelize;
