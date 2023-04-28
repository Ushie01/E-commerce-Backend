const crypto = require('crypto');
  const Flutterwave = require('flutterwave-node-v3');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../modals/userModels');
const AppError = require('./../utils/appError');
const Email = require('../utils/email');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// CREATING JWT SECRET TOKEN
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  //   res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};


// SIGNUP CONTROLLER
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  newUser.active = undefined;
  newUser.emailConfirmed = undefined;

  const user = await User.findOne({ email: req.body.email });
  const resetOtp = user.createPasswordConfirmOtp();
  await user.save({ validateBeforeSave: false });

  const message = `Thank you for signing up with the Juliana's brand we are so proud to have you on board with us
    Kindly respond with the OTP provided below                                                          
    ${resetOtp}
  `

  try {
    Email(req.body.email, message)
  } catch (error) {
    return next(
        new AppError('There was an error sending the email. Try again later', 500)
    )
  }

  createSendToken(newUser, 201, res);
});


//LOGIN CONTROLLER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  };

  if (!user.emailConfirmed) {
    return next(new AppError('Please confirm your email to login', 401))
  };

  user.emailConfirmed = undefined;
  user.otp = undefined;
  user.__v = undefined;
  
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.googleAcctLogin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }); 
  console.log(user);
  user.__v = undefined;
  
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
})


// PROTECT CONTROLLER
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(
            new AppError('You are not authorized, please provide a valid token', 401)
        )
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if user still exist.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError('The user belonging to this token does no longer exist.',
                401
            )
        )
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        )
    };
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});


// RETRICTING ADMIN OR USER TO CERTAIN ROUTE
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            )
        }
        next();
    };
};


// FORGET PASSWORD CONTROLLER
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return next(new AppError('There is no user with this email address', 404));
  }
  // 2) Generate the random reset
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `http://localhost:3000/resetPassword/${resetToken}`;
  const message = `Forgot your password? Click on the link below to create new password:
  ${resetURL}.\nIf you didn't forget your password please ignore this email!`;

  try {
    Email(req.body.email, message);
      res.status(200).json({
          status: 'success',
          message: 'Token sent to email!'
      })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError('There was an error sending the email. Try again later', 500)
        )
    }

});


//RESET PASSWORD CONTROLLER
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // If token has not expired, and there is user, set the new password.
  if (!user) {
      return next(new AppError('Token is invalid or has expired', 400))
  }
  
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // Update changedPasswordAt property for the user.
  // Log the user in, send JWT.
  createSendToken(user, 200, res);
});


// EMAIL VERIFICATION CONTROLLER
exports.emailVerification = catchAsync(async (req, res, next) => {
  // const otp = await User.updateOne({ emailVerification: req.body.emailVerification }, { active: true });
  try{
    const hashedOtp = crypto
      .createHash('sha256')
      .update((req.body.otp).toString())
      .digest('hex');

    const user = await User.findOne({
      otp: hashedOtp,
      otpResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400))
    } else {
      await User.updateOne({ otp: hashedOtp }, { emailConfirmed: true });
    }

    user.otp = undefined;
    user.otpResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: 'Email successfully verified'
    });
  } catch(error) {
    console.error(error)
  }
});


exports.resendToken = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      user.otp = undefined;
      user.otpResetExpires = undefined;
      const resendOtp = user.createPasswordConfirmOtp();
      await user.save({ validateBeforeSave: false });

      const message = `Thank you for signing up with the Juliana's brand we are so proud to have you on board with us
      Kindly respond with the OTP provided below                                                          
      ${resendOtp}
    `
      Email(email, message)
      res.status(200).json({
        status: "success",
        message: 'Token sent to email'
      });
  } catch (error) {
    return next(
        new AppError('There was an error sending the email. Try again later', 500)
    )
  }
})

// UPDATE PASSWORD CONTROLLER                  
exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.body.id).select('+password');
  // If posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your password is wrong', 404))
  }
  // update the current password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //Log user in, send JWT.
  createSendToken(user, 200, res);
});

