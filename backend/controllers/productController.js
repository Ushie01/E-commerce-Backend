const AppError = require('../utils/appError');
const Product = require('../modals/productModels');
const catchAsync = require('../utils/catchAsync');


const reqBody = req => ({ 
    price: req.body.price,
    size: req.body.size,
    ratingsAverage: req.body.ratingsAverage,
    ratingsQuantity: req.body.ratingsQuantity,
    productGallery: req.files.map(path => path.path),
    name: req.body.name,
    description: req.body.description,
    brand: req.body.name,
    category: req.body.category,
    collectionsData: req.body.collectionsData
});


//CREATE PRODUCT CONTROLLER
exports.createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await Product.create(reqBody(req));
    await newProduct.save({ validateBeforeSave: false });

    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct
        }
    });
});


// GET SINGLE PRODUCT CONTROLLER
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
        .populate('reviews');

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


// GET ALL PRODUCT CONTROLLER
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


// UPDATE SINGLE PRODUCT CONTROLLER
exports.updateProduct = catchAsync(async (req, res, next) => {

    const product = await Product.findByIdAndUpdate(req.params.id,
        reqBody(req), {
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


//DELETE SINGLE PRODUCT CONTROLLER
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



