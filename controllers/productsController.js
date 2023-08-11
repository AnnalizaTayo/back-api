const Product = require('../models/Product');
const optimizeImage = require('../utils/optimizeImage');
const sharp = require('sharp');
const { Buffer } = require('buffer');
const maxSize = 10 * 1024 * 1024;

// Controller to handle product creation
exports.createProduct = async (req, res) => {
  try {
    const { productName, description, color } = req.body;
    const file = req.files.productImg;

    console.log(req.body);
    console.log(file[0].buffer);

    const productImgBuffer = await optimizeImage(file[0].buffer, maxSize);

    const productBuffer = await sharp(productImgBuffer)
      .resize(800, 600, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();

    const productThumbnailBuffer = await sharp(productImgBuffer)
      .resize(200, 200, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();

    const newProduct = new Product({
      productName,
      productImg: 
        {
          filename: file[0].filename,
          data: productBuffer,
          thumbnail: productThumbnailBuffer,
          contentType: file[0].mimetype,
        },
      description,
      color,
    });

    // Store the new product in the data store
    const savedProduct = await newProduct.save();
    // Respond with the newly created product as the API response
    res.status(201).json({ message: 'A newlisting is created successfully', product: savedProduct });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).select('-productImg');

    res.status(200).send({ products: allProducts });
  } catch (error) {
    console.error('Error retrieving products:', error.message);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

exports.getAllProductIDs = async (req, res) => {
  try {
    const allProducts = await Product.find({}).select('_id');

    res.status(200).send({ products: allProducts });
  } catch (error) {
    console.error('Error retrieving products:', error.message);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

exports.getProductThumbnailById = async (req, res) => {
  const productId = req.params.productId; // Retrieve companyId from the request parameters

  try {
    const product = await Product.findOne({ _id: productId }).select('productImg.contentType productImg.thumbnail');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.productImg || !product.productImg.thumbnail) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    const imageBuffer = Buffer.from(product.productImg.thumbnail.buffer, 'base64');

    res.set('Content-Type', product.productImg.thumbnail.contentType);
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the product thumbnail' });
  }
};


exports.getProductImageById = async (req, res) => {
  const productId = req.params.productId; // Retrieve companyId from the request parameters

  try {
    const product = await Product.findOne({ _id: productId }).select('productImg.contentType productImg.data');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.productImg || !product.productImg.data) {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }

    const imageBuffer = Buffer.from(product.productImg.data.buffer, 'base64');

    res.set('Content-Type', product.productImg.data.contentType);
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the product thumbnail' });
  }
};

exports.getProductById = async (req, res) => {
  console.log('*******************');
  console.log('received data retrieval request: ProductImg getById');
  console.log('*******************');

  const productId = req.params.productId; // Retrieve companyId from the request parameters

  console.log('*******************');
  console.log(`received data retrieval request for ${productId}`);
  console.log('*******************');
  try {
    const product = await Product.findOne({ _id: productId }).select('-productImg');

    console.log('*******************');
    console.log('Retrieved product:');
    console.log(product);
    console.log('*******************');

    if (!product) {
      console.log('*******************');
      console.log(`Product ${productId} not found`);
      console.log('*******************');
      return res.status(404).json({ error: 'Product not found' });
    } else {
      console.log('*******************');
      console.log(`Product ${product} Found!`);
      console.log('*******************');
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the product thumbnail' });
  }
};

exports.getProductByIdNoImage = async (req, res) => {
  console.log('*******************');
  console.log('received data retrieval request: ProductImg getById');
  console.log('*******************');

  const productId = req.params.productId; // Retrieve companyId from the request parameters

  console.log('*******************');
  console.log(`received data retrieval request for ${productId}`);
  console.log('*******************');
  try {
    const product = await Product.findOne({ _id: productId }).select('-productImg');

    console.log('*******************');
    console.log('Retrieved product:');
    console.log(product);
    console.log('*******************');

    if (!product) {
      console.log('*******************');
      console.log(`Product ${productId} not found`);
      console.log('*******************');
      return res.status(404).json({ error: 'Product not found' });
    } else {
      console.log('*******************');
      console.log(`Product ${product} Found!`);
      console.log('*******************');
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching the product thumbnail' });
  }
};

exports.deleteProductById = async (req, res) => {
  console.log('*******************');
  console.log('received data deletion request: ProductImg deleteById');
  console.log('*******************');

  const productId = req.params.productId; // Retrieve productId from the request parameters

  console.log('*******************');
  console.log(`received data deletion request for ${productId}`);
  console.log('*******************');

  try {
    const product = await Product.findOneAndDelete({ _id: productId });

    if (!product) {
      console.log('*******************');
      console.log(`Product ${productId} not found`);
      console.log('*******************');
      return res.status(404).json({ error: 'Product not found' });
    } else {
      console.log('*******************');
      console.log(`Product ${productId} has been deleted`);
      console.log('*******************');
    }

    res.json({ message: `Product with ID ${productId} has been deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting the product' });
  }
};

exports.updateProductById = async (req, res) => {
  console.log('*******************');
  console.log('received data update request: ProductImg updateById');
  console.log('*******************');

  const productId = req.params.productId; // Retrieve productId from the request parameters

  console.log('*******************');
  console.log(`received data update request for ${productId}`);
  console.log('*******************');

  const updateFields = {...req.body};

  console.log('This is the received data:');
  console.log('*******************');
  console.log(req.body);
  console.log('*******************');

  // Check if a file is uploaded
  if (req.files && req.files.productImg) {
    console.log('*******************');
    console.log('A file is uploaded:');
    console.log('*******************');

    const file = req.files.productImg;
    
    console.log('*******************');
    console.log(file[0].buffer);
    console.log('*******************');
    console.log('Optimizing Image');
    console.log('*******************');

    const productImgBuffer = await optimizeImage(file[0].buffer, maxSize);

    console.log('*******************');
    console.log('Successful Optimization');
    console.log('*******************');
    console.log('Resizing...');
    console.log('*******************');

    const productBuffer = await sharp(productImgBuffer)
      .resize(800, 600, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();
    
    console.log('*******************');
    console.log('Successful Resizing! Creating thumbnail..');
    console.log('*******************');

    const productThumbnailBuffer = await sharp(productImgBuffer)
      .resize(200, 200, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();

    console.log('*******************');
    console.log('Successfuly created a thumbnail');
    console.log('*******************');

    updateFields.productImg = {
      filename: file[0].filename,
      data: productBuffer,
      thumbnail: productThumbnailBuffer,
      contentType: file[0].mimetype,
    };
  }

  console.log('*******************');
  console.log('Processing to update');
  console.log('*******************');


  try {
    const updatedProduct  = await Product.findByIdAndUpdate(productId,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) {
      console.log('*******************');
      console.log(`Product ${productId} not found`);
      console.log('*******************');
      return res.status(404).json({ message: 'Product not found' });
    } else {
      console.log('*******************');
      console.log('This is the updated product:');
      console.log('*******************');
      console.log(updatedProduct);
      console.log('*******************');
    }

    console.log('*******************');
    console.log(`Product ${productId} update successful!`);
    console.log('*******************');

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating the product' });
  }

};


