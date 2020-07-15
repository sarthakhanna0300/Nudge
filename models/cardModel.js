const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  order: Number,
  listId:{
    type:mongoose.Schema.ObjectId,
    ref:'List',
    required:[true,'Card must belong to a List']
  }
}) 


const Card = mongoose.model('Card', cardSchema);

module.exports = Card;