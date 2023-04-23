const fs = require('fs');
const AppError = require('../utils/appError');
const Product = require('../modals/productModels');
const catchAsync = require('../utils/catchAsync');

//CREATE PRODUCT CONTROLLER
exports.createProduct = catchAsync(async (req, res, next) => {
    const { price, size, name, description, brand, category, collectionsData } = req.body;
    const productGallery = req.files ? req.files.map(path => path.path) : [];
    const newProduct = await Product.create({
        price,
        size,
        productGallery,
        name,
        description,
        brand,
        category,
        collectionsData
    });

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
    const { price, size, name, description, brand, category, collectionsData } = req.body;
    const productGallery = req.files ? req.files.map(path => path.path) : [];
    //Updating Image In Uploads File
    const image = await Product.findById(req.params.id);
    const image1 = image.productGallery[0];
    const image2 = image.productGallery[1];
    const image3 = image.productGallery[2];
    const image4 = image.productGallery[3];

    // console.log(image);
    if (!image) {
        return next(new AppError('No product found with that ID', 404));
    }

    let resultHandler = function (err) {
        if (err) {
            console.log(err);
        }
    }

    if (image1) { fs.unlink(`${image1}`, resultHandler); }
    if (image2) { fs.unlink(`${image2}`, resultHandler); }
    if (image3) { fs.unlink(`${image3}`, resultHandler); }
    if (image4) { fs.unlink(`${image4}`, resultHandler); }

    //Updating product from database
    const product = await Product.findByIdAndUpdate(req.params.id,
        ({
            price,
            size,
            productGallery,
            name,
            description,
            brand,
            category,
            collectionsData
        }), {
            new: true,
            runValidator: true
        });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    };

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



