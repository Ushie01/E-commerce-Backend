const express = require('express');

const {
    signup,
    login,
    // protect,
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
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/emailVerification', emailVerification);

router.use(authController.protect);
router.patch('/updatePassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);


router.use(authController.restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;