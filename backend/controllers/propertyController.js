const upload = require('../middlewares/multer')
const { Op } = require('sequelize');
const Property = require('../models/Property');
const Image = require('../models/Image');
const { uploadToS3 } = require('../services/s3Service');

const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProperties = async (req, res) => {
  try {
    console.log('provider', req.params);
    const { provider } = req.params;
    const whereCondition = provider ? { [Op.or]: [
      { provider : { [Op.substring]: provider } },
      { provider : { [Op.substring]: provider.charAt(0).toUpperCase() + provider.slice(1) } }
    ] } : {};

    
    
    const properties = await Property.findAll({
      where: whereCondition,
      include: [{
        model: Image,
        as: 'Images'
      }]
    });

    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, { include: [Image] });
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (req.file == undefined) {
      return res.status(400).json({ error: 'No file selected!' });
    }

    try {
      const property = await Property.findByPk(req.params.propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const image = await Image.create({
        url: req.file.location, // Use the S3 file URL
        propertyId: req.params.propertyId
      });

      res.json({ message: 'File uploaded successfully', image });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
  });
};

module.exports = { createProperty, getProperties, getPropertyById, uploadImages };
