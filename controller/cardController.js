const Card = require('../models/cardModel')
const List = require('../models/listModel')
const catchAsync = require('./../utils/catchAsync');

exports.getAllCards = catchAsync(async (req,res,next) => {
  const cards = await Card.find({listId: req.params.listId})
  res.status(200).json({
    status: 'success',
    results: cards.length,
    data:{
      cards
    } 
  });
});

exports.getCard = catchAsync(async (req,res,next) => {
  const card = await Card.findById(req.params.cardId);
  res.status(200).json({
    status: 'success',
    data:{
      card
    }
  });
});

exports.createCard = catchAsync(async (req,res,next) => {
  const list = await List.findById(req.params.listId);
  const createCard = {
    text: req.body.text,
    order:list.cards.length+1,
    listId: req.params.listId
  };
  const newCard = await Card.create(createCard);
  list.cards.push(newCard);
  await list.save();
  res.status(201).json({
    status: 'success',  
    data: {
    card: newCard
    }
  });
});

exports.updateCard = catchAsync(async (req,res,next) => {
  const card= await Card.findByIdAndUpdate(req.params.cardId,{
    text:req.body.text
  },
  {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',  
    data: {
      card
    }
  }); 
});

exports.deleteCard = catchAsync(async (req, res,next) => {
  const list = await List.findById(req.params.listId);
  await Card.findByIdAndDelete(req.params.cardId); 
  list.cards = list.cards.filter(
    (card) => card!=req.params.cardId
  );
  await list.save();
  res.status(204).json({
    status: 'success',
    data:null
  }); 
});


