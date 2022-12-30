const Order = require('../modals/orderModels');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);

    res.status(200).json({
        status: 'success',
        data: {
            data: order
        }
    });

});