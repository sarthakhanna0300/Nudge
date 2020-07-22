const Board = require('../models/boardModel');
const List = require('../models/listModel');
const Card = require('../models/cardModel');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
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
  const boards = await Board.find({ ownerId: req.user.id });
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
  const newBoard = await Board.create(filteredBody);
  user.boards.push(newBoard);
  newBoardArr=user.boards;
  const currentUser = await User.findByIdAndUpdate(req.user.id,{boards:newBoardArr});
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
  const user = await User.findById(req.user.id);
  await Board.findByIdAndDelete(req.params.boardId); 
  user.boards = user.boards.filter(
    (board) => board!=req.params.boardId
  );
  await User.findByIdAndUpdate(req.user.id,{boards:user.boards});
  await List.deleteMany({boardId:req.params.boardId});
  await Card.deleteMany({boardId:req.params.boardId});
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});
