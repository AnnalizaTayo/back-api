const sharp = require('sharp');

// Define the function to optimize the image
const optimizeImage = (buffer, maxSizeInBytes) => {
  if (buffer.length <= maxSizeInBytes) {
    // If the image is already smaller than or equal to the maxSize, return it as is
    return buffer;
  }

  return new Promise((resolve, reject) => {
    // Compress the image without affecting the quality
    sharp(buffer)
      .resize({ size: maxSizeInBytes }) // Resize the image to a maximum size (25MB in this case)
      .toBuffer() // Get the optimized image buffer directly
      .then((optimizedImageBuffer) => {
        resolve(optimizedImageBuffer); // Resolve with the optimized image buffer
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = optimizeImage;
