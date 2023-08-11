const express = require('express');
const multer = require('multer');
const companyController = require('../controllers/companyController.js');


const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
    { name: 'companyLogo', maxCount: 1 },
    { name: 'highlightCollection', maxCount: 1 },
  ]);

//company
router.put('/update', upload, companyController.updateCompany);

router.get('/info', companyController.getCompany);
router.get('/info-noimages', companyController.getCompanyNoImages);
router.get('/logo', companyController.getCompanyLogo);
router.get('/favicon', companyController.getCompanyFavicon);
router.get('/highlight', companyController.getCompanyHighlight);

module.exports = router;
