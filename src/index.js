const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const compression = require('compression');
// const serverless = require("serverless-http");
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes')
const AppError = require('./utils/appError');
const index = express();


// Global Middlewares
// Set security HTTP headers
index.use(helmet({
    crossOriginResourcePolicy: false,
}));

index.use('/api/v1/products/uploads', express.static('uploads'));


// Compressing upcompressed files which is been sent to client such text.
index.use(compression());

if (process.env.NODE_ENV === 'development') {
    index.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 2 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour'
});

index.use('/api', limiter);
index.set('view engine', 'ejs');
index.set('views', path.join(__dirname, 'views'));

//implement CORS
index.use(cors());

const corsOptions = {
    origin: [
        'https://e-commerce-frontend-plt0.onrender.com',
        'https://e-commerce-frontend-6i0klmujm-ushie01.vercel.app',
        'https://api.flutterwave.com/v3/payments',
        'http://localhost:3000'
    ],
  methods: 'GET, POST, PUT, DELETE, PATCH',
  optionsSuccessStatus: 200
};


index.use(cors(corsOptions));


index.use(express.json({ limit: '500000' }));
// Data sanitization against NoSQL query injection
index.use(mongoSanitize());
// Data sanitization against Sanitize untrusted HTML (Cross Side Server)
index.use(xssClean());


index.use(express.static(path.join(__dirname, 'public')));
index.use(morgan('dev'));                                                 
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
// module.exports.handler = serverless(index);
// exports.index = functions.https.onRequest(index);