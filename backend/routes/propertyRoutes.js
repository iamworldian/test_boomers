const express = require('express');
const { createProperty, getProperties, getPropertyById, uploadImages } = require('../controllers/propertyController');
const { protect , authorizeRole} = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.route('/:provider')
  .post(protect,createProperty)
  .get(protect, getProperties);

router.route('/byid/:id')
  .get(protect, getPropertyById);

router.route('/:propertyId/images')
  .post(protect, authorizeRole('admin'), uploadImages);

module.exports = router;
