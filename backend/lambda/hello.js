const catchAsync = require('../utils/catchAsync');

// exports.handler = catchAsync(async (event, context) => {
//     return {
//         statusCode: 200,
//         body: JSON.stringify({
//             message: 'Hello, World!',
//         }),
//     }
// });

exports.handler = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'Hello World',
    });
});
