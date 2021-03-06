const User = require('../models/userModel');
const Board = require('../models/boardModel');
const List = require('../models/listModel');
const Card = require('../models/cardModel');
const catchAsync = require('./../utils/catchAsync');
const appError=require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('avatarURL');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req,res,next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data:{
      users
    } 
  });
});

exports.getMe = catchAsync(async (req,res,next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    data:{
      user
    } 
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if(req.body.password || req.body.passwordConfirm) {
    return next(new appError('This route is not for password updates. Please use /updateMyPassword.',400));
  }
  const filteredBody = filterObj(req.body, 'name');
  console.log(req.file);
  if (req.file) filteredBody.avatarURL= req.file.filename; 
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const boards = await Board.find({members: [req.user.id]});
  boards.forEach(async (board) => {
    board.members=board.members.filter(
      (member)=>(member)!=req.user.id
    )
  await Board.findByIdAndUpdate(board.id,{members:board.members});
  }); 
  await Board.deleteMany({ownerId:req.user.id});
  await List.deleteMany({ownerId:req.user.id});
  await Card.deleteMany({ownerId:req.user.id});
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = catchAsync(async (req,res,next) => {
  const user = await User.findById(req.params.userId);
  res.status(200).json({
    status: 'success',
    data:{
      user
    }
  });
});

exports.createUser = catchAsync(async (req,res,next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',  
    data: {
    user: newUser
    }
  });
});

exports.updateUser = catchAsync(async (req,res,next) => {
  const user= await User.findByIdAndUpdate(req.params.userId,req.body, {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',  
    data: {
      user
    }
  });
});

exports.deleteUser = catchAsync(async (req,res,next) => {
  await User.findByIdAndDelete(req.params.userId);
  await Board.deleteMany({ownerId:req.params.userId}); 
  await List.deleteMany({ownerId:req.params.userId});
  await Card.deleteMany({ownerId:req.params.userId});
  res.status(204).json({
    status: 'success',
    data:null
  });  
});
