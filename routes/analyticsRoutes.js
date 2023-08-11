const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

//counting page views
router.get('/', analyticsController.viewsCount) 

//responds with views and visits count
router.get('/weekly-page-views', analyticsController.getViewCount); 
router.get('/weekly-visit-counts', analyticsController.getVisitCount); 

module.exports = router;