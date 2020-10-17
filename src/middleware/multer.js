// const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');
// const DatauriParser = require('datauri/parser');
const AppError = require('../utils/appError');
const config = require('../config');

// Instantiate parser
// const parser = new DatauriParser();

// MULTER CONFIG - starts here

// set storage engine
const storage = multer.memoryStorage();

// Set fileSize limit - 1MB
const limits = {
  fileSize: 1000000,
};

// specify acceptable files
const fileFilter = (req, file, cb) => {
  // accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new AppError('Please upload an image file', 400));
  }
  // else accept the file
  return cb(null, true);
};

// Init upload middleware
const upload = multer({ storage, limits, fileFilter });

exports.uploadSingle = upload.single('photo');

// MULTER CONFIG - ends here

// CLOUDINARY CONFIG - starts here
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// // CLOUDINARY CONFIG - ends here

// // Upload an image
// app.post('/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, error: 'Please upload a file' });
//     }

//     console.log(req.file);

//     // remove an existing image in cloudinary
//     // if (req.user.photoId) {
//     //   await uploader.destroy(req.user.photoId);
//     // }

//     const image = parser.format(
//       path.extname(req.file.originalname).toString(),
//       req.file.buffer,
//     ).content;

//     const result = await cloudinary.uploader.upload(image, {
//       folder: 'konnet',
//     });

//     console.log(result.secure_url);

//     return res.status(201).send();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, error: 'unable to upload' });
//   }
// });

// // Upload multiple images
// app.post('/photos/upload', upload.array('photos', 2), async (
//   req,
//   res,
// ) => {
//   // req.files is an array of `photos` files
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, error: 'Please upload a file' });
//     }

//     // console.log(req.files); //array - [{}, {}]

//     const images = req.files;

//     images.forEach(async (image) => {
//       const img = parser.format(
//         path.extname(image.originalname).toString(),
//         image.buffer,
//       ).content;
//       const result = await cloudinary.uploader.upload(img, {
//         folder: 'konnet',
//       });

//       console.log(result.secure_url);
//     });
//     return res.status(201).send();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, error: 'unable to upload' });
//   }
// });
