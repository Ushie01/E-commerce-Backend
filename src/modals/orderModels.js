const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        qty: { type: String, required: true },
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
      firstName: { type: String, require: true },
      lastName: { type: String, require: true }
    },
    paymentMethod: {
      type: String,
      required: [true, 'A payment method is required']
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)


orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderItems.product',
    select: '-ratingsAverage -ratingsQuantity -gallery -numReviews -rating -reviews -__v'
  });

  next();
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
