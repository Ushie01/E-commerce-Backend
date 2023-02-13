const express = require('express');
const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    emailVerification
} = require('./../controllers/authController')
const {
    getAllUsers,
    getUser,
    updateUser,
    updateMe,
    deleteUser,
    deleteMe,
} = require('./../controllers/userController'); 
const authController = require('./../controllers/authController');
const orderRouter = require('./../routes/orderRoutes');
const router = express.Router();


router.use('/:userId/orders', orderRouter);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/emailVerification', emailVerification);


router.use(authController.protect);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.route('/:id').get(getUser)


router.use(authController.restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);


module.exports = router;