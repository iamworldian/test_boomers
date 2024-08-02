const { protect } = require('../middlewares/auth');

const express = require('express');
const scrapperController = require('../controllers/scrapperController');

const router = express.Router();

router.route('/submit-search')
      .post(protect,(req, res) => {
        const { location } = req.body;
        
        switch (location) {
          case 'texas':
            return scrapperController.texasSiteScrap(req, res);
          case 'other':
            return scrapperController.otherSiteScrap(req, res);
          // Add more cases for other locations
          default:
            return res.status(400).json({ error: 'Invalid location specified' });
        }
});

module.exports = router;
