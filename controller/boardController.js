const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllBoards = catchAsync(async (req,res,next) => {
  const boards = await Board.find();
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
  console.log(board);
  res.status(200).json({
    status: 'success',
    data:{
      board
    }
  });
});

exports.createBoard = catchAsync(async (req,res) => {
  const newBoard = await Board.create(req.body);
  res.status(201).json({
    status: 'success',  
    data: {
    board: newBoard
    }
  });
});

exports.updateBoard = catchAsync(async (req,res,next) => {
  const board= await Board.findByIdAndUpdate(req.params.boardId,req.body, {
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
  const board = await Board.findByIdAndDelete(req.params.boardId); 
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});
