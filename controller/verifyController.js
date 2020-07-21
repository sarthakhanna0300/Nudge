const Card = require('../models/cardModel')
const List = require('../models/listModel')
const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');

exports.checkBoardExistence = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  next();
});

exports.checkListExistence = catchAsync(async (req,res,next) => {
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  next();
});

exports.checkCardExistence = catchAsync(async (req,res,next) => {
  const card = await Card.findById(req.params.cardId);
  if(!card)
  {
    return next(new appError('No Card found with that Id',404));
  }
  next();
});

exports.checkListinBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  const exist  = board.lists.filter(
    (list) => list==req.params.listId
  );
  if(exist.length==0)
  {
    return next(new appError('This List belongs to other Board',404));
  }
  next();
});

exports.checkCardinList = catchAsync(async (req,res,next) => {
  const list = await List.findById(req.params.listId);
  const exist  = list.cards.filter(
    (card) => card==req.params.cardId
  );
  console.log(exist);
  if(exist.length==0)
  {
    return next(new appError('This Card belongs to other List',404));
  }
  next();
});

exports.checkOwnerinBoard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(board.ownerId!=req.user.id)
  {
    return next(new appError('This Board  not belongs to You',404));
  }
  next();
});