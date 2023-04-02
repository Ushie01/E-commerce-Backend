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


// GET ALL USER CONTROLLER
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate('orders');
    
    users.map(value => {
      value.otp = undefined, 
      value.__v = undefined,
      value.emailConfirmed = undefined,
      value.passwordResetExpires = undefined,
      value.passwordResetToken = undefined
    });
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});


// USER UPDATE CONTROLLER
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
  const updateUser = await User.findByIdAndUpdate(req.body.id, filteredBody, {
    new: true,
    runValidators: true
  });

  updateUser.otp = undefined;
  updateUser.__v = undefined;
  updateUser.emailConfirmed = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});


//USER DELETE CONTROLLER
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});


//GET SINGLE USER CONTROLLER
exports.getUser = catchAsync(async (req, res, next) => {
  let query = User.findById(req.user._id).populate('orders');
  const user = await query;

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }

  user.otp = undefined;
  user.__v = undefined;
  user.emailConfirmed = undefined;

  res.status(200).json({
    status: 'success',
    data: user
  })
})


//ADMIN UPDATE USER CONTROLLER
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }

  user.otp = undefined;
  user.__v = undefined;
  user.emailConfirmed = undefined;

  res.status(500).json({
    status: 'success',
    data: {
      data: user
    }
  });
});


//ADMIN DELETE USER CONTROLLER
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




