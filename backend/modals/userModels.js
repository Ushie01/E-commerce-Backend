const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'Please tell us your name']
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lower: true,
            validator: [validator.isEmail, 'Please provide a valid email']
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        confirmPassword: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                validator: function (el) {
                    return el === this.password;
                }
            },
            message: "Password are not the same."
        },
        otp: String,
        otpResetExpires: Date,
        emailConfirmed: {
            type: Boolean,
            default: false,
            select: true
        },
        passwordChangeAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


userSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id'
});


userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm
    this.confirmPassword = undefined;

    next();
});



userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
})


userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next();
})


userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordConfirmOtp = function () {
    const min = 100000;
    const max = 999999;
    const results = Math.floor(Math.random() * (max - min + 1)) + min;
    
    this.otp = crypto.createHash('sha256')
        .update((results).toString())
        .digest('hex'); 
    console.log(this.otp);
    
    this.otpResetExpires = Date.now() + 10 * 60 * 1000;
    return results
}


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


const User = mongoose.model('User', userSchema);
module.exports = User;