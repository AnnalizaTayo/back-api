const express = require('express');
const router = express.Router();
const faqsController = require('../controllers/faqsController');

router.route('/')
    .get(faqsController.getFaqs)
    .post(faqsController.addFaqs)
    
router.delete('/:faqsId', faqsController.deleteFaqs)
router.put('/:faqsId', faqsController.updateFaqs);
router.get('/:faqsId', faqsController.getOneFaqsById);
module.exports = router;