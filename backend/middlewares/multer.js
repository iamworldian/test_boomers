const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const s3 = require('../services/s3Service');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'testbucketboomershub',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
    ACL:'public-read'
  }),
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); 

function checkFileType(file, cb) {
  console.log('file',file);
  const filetypes = /jpeg|jpg|png|gif/;
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = upload;
