const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true,'Board Must have a name'],
    maxlength: [40, 'A Board name must have less then 40 characters']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    default:'white.jpg'
  },
  starred:{
    type:Boolean,
    default:false
  },
  lists:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'List'
  }],
  ownerId:{ 
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'Board must belong to a User']
  },
  members:[
   { type:mongoose.Schema.ObjectId,
    ref:'User'}
  ]
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;