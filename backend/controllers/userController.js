const AppError = require('./../utils/appError');
const User = require('./../modals/userModels')
const catchAsync = require('./../utils/catchAsync');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});


exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'The route is not for password updates. Please use / updateMyPassword', 400
      )
    )
  }

  // 2 Update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});


exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.getUser = catchAsync(async (req, res, next) => {
  let query = User.findById(req.user._id)
    .populate('orders')
    .populate('products');
  const user = await query;

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user
  })
})


exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(500).json({
    status: 'success',
    data: {
      data: user
    }
  });
});


exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No ducument found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: { 
      data: null
    }
  });
});




// exports.uploadProductImage = catchAsync(async (req, res, next) => {
//   console.log(req.file);
//   res.send("Image Uploaded");

//   upload.array('images', 3)
// });

// exports.createUser = catchAsync(async (req, res) => {
//   const user = await User.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: user
//     }
//   });
// });