const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productsController.js');


const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).fields([
    { name: 'productImg', maxCount: 1 },
  ]);

//product
router.post('/create-product', upload, productController.createProduct);
router.get('/allproducts', productController.getAllProducts);
router.get('/allproductids', productController.getAllProductIDs);
router.get('/products-thumbnail/:productId', productController.getProductThumbnailById);
router.get('/products-image/:productId', productController.getProductImageById);
router.get('/product/:productId', productController.getProductById);
router.get('/product-noimage/:productId', productController.getProductByIdNoImage);

router.put('/update-product/:productId', upload, productController.updateProductById);

router.delete('/delete-product/:productId', productController.deleteProductById);

module.exports = router;
