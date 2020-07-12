const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./errorController');


exports.getAllBoards = catchAsync(async (req,res,next) => {
  const boards = await Board.find();
  res.status(200).json({
    status: 'success',
    results: boards.length,
    data:{
      boards
    } 
  })
});


exports.getBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.id);
  if(!board)
  {
    return next(new appError('No document found with that Id',404));
  }
  res.status(200).json({
    status: 'success',
    data:{
      board
    }
  })
})


exports.createBoard = catchAsync(async (req,res) => {
  const newBoard = await Board.create(req.body);
  res.status(201).json({
    status: 'success',  
    data: {
    board: newBoard
    }
  });
})


exports.updateBoard = catchAsync(async (req,res,next) => {
  const board= await Board.findByIdAndUpdate(req.params.id,req.body, {
    new: true,
    runValidators: true
  }); 
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  res.status(200).json({
    status: 'success',  
    data: {
      board
    }
  }); 
})

exports.deleteBoard = catchAsync(async (req, res,next) => {
  const board = await Board.findByIdAndDelete(req.params.id); 
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});
