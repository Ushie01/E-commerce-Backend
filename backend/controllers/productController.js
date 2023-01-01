const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');
const Product = require('../modals/productModels');
const catchAsync = require('../utils/catchAsync');


exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newProduct
        }
    });

});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews');

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });

});

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});



exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });

});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: null
    })
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage });

exports.getImage = catchAsync(async (req, res, next) => {
  res.render("upload");
});

exports.uploadProductImage = upload.single('image');