const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true,'Board Must have a name'],
    maxlength: [40, 'A List name must have less then 40 characters']
  },
  order: Number,
  ownerId:{ 
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'List must belong to a User']
  },
  boardId:{ 
    type:mongoose.Schema.ObjectId,
    ref:'Board',
    required:[true,'List must belong to a Board']
  },
  cards:[{
    type:mongoose.Schema.ObjectId,
    ref:'Card'
  }]
}) 

const List = mongoose.model('List', listSchema);

module.exports = List;