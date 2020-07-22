const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  order: Number,
  listId:{
    type:mongoose.Schema.ObjectId,
    ref:'List',
    required:[true,'Card must belong to a List']
  },
  boardId:{ 
    type:mongoose.Schema.ObjectId,
    ref:'Board',
    required:[true,'List must belong to a Board']
  },
  ownerId:{ 
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'Card must belong to a User']
  }
}) 

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;