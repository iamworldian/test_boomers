const Image = require('./Image');

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Property = sequelize.define('Property', {
  provider: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  zipCode: DataTypes.STRING,
  county: DataTypes.STRING,
  phone: DataTypes.STRING,
  type: DataTypes.STRING,
  capacity: DataTypes.STRING,
  map: DataTypes.STRING
});

Property.hasMany(Image)


module.exports = Property;
