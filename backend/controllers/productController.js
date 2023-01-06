const AppError = require('../utils/appError');
const Product = require('../modals/productModels');
const catchAsync = require('../utils/catchAsync');


exports.createProduct = catchAsync(async (req, res, next) => {
     console.log(req.files);
    // if (!req.body.image) req.body.image = req.file.path;
    const newProduct = await Product.create({
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


    await newProduct.save({ validateBeforeSave: false });
    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct
        }
    });
});


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


// exports.getImage = catchAsync(async (req, res, next) => {
//   res.render("upload");
// });

// exports.uploadProductImage = ;
