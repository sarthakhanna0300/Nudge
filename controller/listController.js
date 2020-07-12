const List = require('../models/listModel');
const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');

exports.getAllLists = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const lists = await List.find({boardId: req.params.boardId});
  res.status(200).json({
    status: 'success',
    results: lists.length,
    data:{
      lists
    } 
  })
});

exports.getList = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.id);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  res.status(200).json({
    status: 'success',
    data:{
      list
    }
  })
})


exports.createList = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  console.log(board)
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  List.create(req.body).then((newList) => {
    board.lists.unshift(newList._id);
    res.status(201).json({
      status: 'success',  
      data: {
      list: newList
      }
    });
  }).catch(e => console.log(e.message))
  
})


exports.updateList = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list= await List.findByIdAndUpdate(req.params.id,req.body, {
    new: true,
    runValidators: true
  }); 
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  res.status(200).json({
    status: 'success',  
    data: {
      list
    }
  }); 
})

exports.deleteList = catchAsync(async (req, res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findByIdAndDelete(req.params.id); 
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});


