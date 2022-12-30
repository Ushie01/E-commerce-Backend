const path = require('path');
const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes')
const index = express();
const AppError = require('./utils/appError');

index.set('view engine', 'ejs');
index.set('views', path.join(__dirname, 'views'));
index.use(express.static(path.join(__dirname, 'public')));

index.use(morgan('dev'));                                                 
index.use(express.json());
index.use('/api/v1/products', productRouter);
index.use('/api/v1/users', userRouter);
index.use('/api/v1/reviews', reviewRouter);
index.use('/api/v1/orders', orderRouter);


// Handing Unhandled Routes
index.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// globalErrorHandler
index.use(globalErrorHandler);
module.exports = index;