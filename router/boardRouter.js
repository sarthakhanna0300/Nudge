const express =require('express');
const boardController = require('../controller/boardController.js');
const listRouter = require('./listRouter');
const verifyController=require('../controller/verifyController');
const authController= require('../controller/authController');
const router =express.Router();

router.use(authController.protect);
router.use('/:boardId/list',listRouter);

router.patch('/:boardId/addMember/:memberId',verifyController.checkBoardExistence,verifyController.checkOwnerinBoard,boardController.addMemberToBoard);
router.delete('/:boardId/deleteMember/:memberId',verifyController.checkOwnerinBoard,verifyController.checkBoardExistence,boardController.deleteMemberFromBoard);

router
  .route('/')
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route('/:boardId')
  .get(verifyController.checkBoardExistence,verifyController.checkOwnerinBoard,boardController.getBoard)
  .patch(verifyController.checkBoardExistence,verifyController.checkOwnerinBoard,boardController.uploadCoverPhoto,boardController.resizeCoverPhoto,boardController.updateBoard)
  .delete(verifyController.checkBoardExistence,verifyController.checkOwnerinBoard,boardController.deleteBoard);

module.exports = router;
