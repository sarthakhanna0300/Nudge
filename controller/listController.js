const List = require('../models/listModel');
const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllLists = catchAsync(async (req,res,next) => {
  const lists = await List.find({boardId: req.params.boardId});
  res.status(200).json({
    status: 'success',
    results: lists.length,
    data:{
      lists
    } 
  });
});

exports.getList = catchAsync(async (req,res,next) => {
  const list = await List.findById(req.params.listId).populate({ path: 'cards', select: 'text' });
  res.status(200).json({
    status: 'success',
    data:{
      list
    }
  });
});

exports.createList = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  const createList = {
    name: req.body.name,
    order:board.lists.length+1,
    boardId: req.params.boardId
  };
  const newList = await List.create(createList);
  board.lists.push(newList);
  await board.save();
  res.status(201).json({
    status: 'success',  
    data: {
    list: newList
    }
  });
});

exports.updateList = catchAsync(async (req,res,next) => {
  const list= await List.findByIdAndUpdate(req.params.listId,{
    name:req.body.name
  }, 
  {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',  
    data: {
      list
    }
  }); 
});

exports.deleteList = catchAsync(async (req, res,next) => {
  const board = await Board.findById(req.params.boardId);
  await List.findByIdAndDelete(req.params.listId); 
  board.lists = board.lists.filter(
    (list) => list!=req.params.listId
  );
  await board.save();
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});


