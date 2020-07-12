const mongoose = require('mongoose');
// const team = require('./teamModel');

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
    default:'white'
  },
  starred:{
    type:Boolean,
    default:false
  },
  lists:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'List'
  }]
  // ownerId:mongoose.Schema.Types.ObjectId
  // teamId:{
  //   type:mongoose.Schema.ObjectId,
  //       ref:'team'
  // },
  // permission:{
  //   type:Boolean,
  //   default:false
  // }
}) 


const Board = mongoose.model('Board', boardSchema);

module.exports = Board;