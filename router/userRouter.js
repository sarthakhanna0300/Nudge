const express =require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const router =express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/logout',authController.logout);

router.use(authController.protect);

router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe',userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe',userController.deleteMe);
router.get('/me',userController.getMe);

router.use(authController.isAdmin);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
.route('/:userId')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;