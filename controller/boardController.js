const Board = require('../models/boardModel');
const List = require('../models/listModel');
const Card = require('../models/cardModel');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const appError = require('../utils/appError');

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

exports.uploadCoverPhoto = upload.single('imageCover');

exports.resizeCoverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `board-${req.params.boardId}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/boards/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllBoards = catchAsync(async (req,res,next) => {
  const boards = await Board.find({members: [req.user.id]});
  res.status(200).json({
    status: 'success',
    results: boards.length,
    data:{
      boards
    } 
  });
});

exports.getBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId).populate({path:'lists',select:"name"});
  res.status(200).json({
    status: 'success',
    data:{
      board
    }
  });
});

exports.createBoard = catchAsync(async (req,res,next) => {
  const user = await User.findById(req.user.id);
  const filteredBody = filterObj(req.body, 'name', 'description','imageCover','starred');
  filteredBody.ownerId = req.user.id;
  var member =[];
  member.push(req.user.id);
  filteredBody.members=member;
  const newBoard = await Board.create(filteredBody);
  res.status(201).json({
    status: 'success',  
    data: {
    board: newBoard
    }
  });
});

exports.updateBoard = catchAsync(async (req,res,next) => {
  const filteredBody = filterObj(req.body, 'name', 'description','imageCover','starred');
  if (req.file) filteredBody.imageCover= req.file.filename; 
  console.log(filteredBody.imageCover);
  const board= await Board.findByIdAndUpdate(req.params.boardId,filteredBody, {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',  
    data: {
      board
    }
  }); 
});

exports.deleteBoard = catchAsync(async (req, res,next) => {
  board = await Board.findById(req.params.boardId);
  if(req.user.id!=board.ownerId)
    {
      return next(new appError('Only Owner is allowed to delete the board',404));
    }
  await Board.findByIdAndDelete(req.params.boardId);  
  await List.deleteMany({boardId:req.params.boardId});
  await Card.deleteMany({boardId:req.params.boardId});
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});

exports.addMemberToBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(req.user.id!=board.ownerId)
  {
    return next(new appError('Only Owner is allowed to add member to the board',404));
  }
  const user = await User.findById(req.params.memberId);
  if(!user)
  {
    return next(new appError('User not found!',404));
  }
  var exist = board.members;
  exist = exist.filter(
    (member) => member==req.params.memberId
  );
  if(exist.length==1)
  {
    return next(new appError('User is already present in board member',404));
  }
  board.members.push(user);
  newMembersArr=board.members;
  await Board.findByIdAndUpdate(req.params.boardId,{members:newMembersArr});
  res.status(201).json({
    status: 'success',  
    data: {
    board
    }
  });
});

exports.deleteMemberFromBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(req.user.id!=board.ownerId)
  {
    return next(new appError('Only Owner is allowed to delete member from the board',404));
  }
  if(req.params.memberId==board.ownerId)
  {
    return next(new appError('Owner cannot delete himself/herself from board Members',404));
  }
  const user = await User.findById(req.params.memberId);
  if(!user)
  {
    return next(new appError('User not found!',404));
  }
  board.members = board.members.filter(
    (member) => member!=req.params.memberId
  );
  await Board.findByIdAndUpdate(req.params.boardId,{members:board.members});
  res.status(201).json({
    status: 'success',  
    data: {
    board
    }
  });
});
