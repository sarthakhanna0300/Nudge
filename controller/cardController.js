const Card = require('../models/cardModel')
const List = require('../models/listModel')
const Board = require('../models/boardModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('../utils/appError');

exports.getAllCards = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  const cards = await Card.find({listId: req.params.listId})
  res.status(200).json({
    status: 'success',
    results: cards.length,
    data:{
      cards
    } 
  })
});


exports.getCard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  const card = await Card.findById(req.params.id);
  if(!card)
  {
    return next(new appError('No Card found with that Id',404));
  }
  res.status(200).json({
    status: 'success',
    data:{
      card
    }
  })
})


exports.createCard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  const newCard = await Card.create(req.body);
  list.cards.push();
  res.status(201).json({
    status: 'success',  
    data: {
    card: newCard
    }
  });
})


exports.updateCard = catchAsync(async (req,res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  const card= await Card.findByIdAndUpdate(req.params.id,req.body, {
    new: true,
    runValidators: true
  }); 
  if(!card)
  {
    return next(new appError('No Card found with that Id',404));
  }
  res.status(200).json({
    status: 'success',  
    data: {
      card
    }
  }); 
})

exports.deleteCard = catchAsync(async (req, res,next) => {
  const board = await Board.findById(req.params.boardId);
  if(!board)
  {
    return next(new appError('No Board found with that Id',404));
  }
  const list = await List.findById(req.params.listId);
  if(!list)
  {
    return next(new appError('No List found with that Id',404));
  }
  const card = await Card.findByIdAndDelete(req.params.id); 
  if(!card)
  {
    return next(new appError('No Card found with that Id',404));
  }

  res.status(204).json({
    status: 'success',
    data:null
  }); 
});


