// const Team = require('../models/teamModel');
// const catchAsync = require('./../utils/catchAsync');
// const appError = require('./errorController');

// exports.getAllBoards = catchAsync(async (req,res) => {
//   const boards = await Board.find({ownerId: req.user.id});
//   // { $or: [ {ownerId: req.user.id},  ] }
//   res.status(200).json({
//     status: 'success',
//     results: boards.length,
//     data:{
//       boards
//     } 
//   })
// });


// exports.getBoard = catchAsync(async (req,res) => {
//   const board = await Board.findById(req.params.id);
//   if(!board)
//   {
//     return next(new appError('No document found with that Id',404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data:{
//       board
//     }
//   })
// })


// exports.createTeam = catchAsync(async (req,res) => {
//   const newBoard = await Team.create(req.body);
//   res.status(201).json({
//     status: 'success',  
//     data: {
//     board: newBoard
//     }
//   });
// })


// exports.updateBoard = catchAsync(async (req,res) => {
//   const board= await Board.findByIdAndUpdate(req.params.id,req.body, {
//     new: true,
//     runValidators: true
//   }); 
//   res.status(200).json({
//     status: 'success',  
//     data: {
//       board
//     }
//   }); 
// })

// exports.deleteBoard = catchAsync(async (req, res) => {
//   await Board.findByIdAndDelete(req.params.id); 
//   res.status(204).json({
//     status: 'success',
//     data:null
//   }); 
// });
