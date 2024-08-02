const { DataTypes } = require('sequelize');
const sequelize = require('./index');


const Image = sequelize.define('Image', {
  url: DataTypes.STRING,
  propertyId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Properties',
      key: 'id'
    }
  }
});

module.exports = Image;
