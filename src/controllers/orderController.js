const Order = require('../modals/orderModels');
const catchAsync = require('./../utils/catchAsync');


exports.setOrderUserIds = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
}


// CREATE ORDER CONTROLLER
exports.createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            data: order
        }
    });

});

// GET SINGLE USER ORDER BY ORDER ID
exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            order
        }
    });
});


// GETTING BOTH SINGLE AND ALL ORDER CONTROLLER
exports.getAllOrders = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };
    const order = await Order.find(filter);
    res.status(200).json({
        status: 'success',
        orders: order.length,
        data: {
            data: order
        }
    })
});


exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!order) {
    return next(new AppError('No document found with that ID', 404));
  }

  order.shippingAddress = undefined;
  order.__v = undefined;
  order.totalPrice = undefined;
  order.orderItems = undefined;
  order.shippingPrice = undefined;
  order.paymentMethod = undefined;
  order.user = undefined;
  order.createdAt = undefined;
  order.updatedAt = undefined

  res.status(200).json({
    status: 'success',
    data: {
      data: order
    }
  });
});
