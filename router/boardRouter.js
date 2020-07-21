const express =require('express');
const boardController = require('../controller/boardController.js');
const listRouter = require('./listRouter');
const verifyController=require('../controller/verifyController');
const authController= require('../controller/authController');
const router =express.Router();

router.use(authController.protect);
router.use('/:boardId/list',listRouter);

router
  .route('/')
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route('/:boardId')
  .get(verifyController.checkOwnerinBoard,verifyController.checkBoardExistence,boardController.getBoard)
  .patch(verifyController.checkOwnerinBoard,verifyController.checkBoardExistence,boardController.uploadCoverPhoto,boardController.resizeCoverPhoto,boardController.updateBoard)
  .delete(verifyController.checkOwnerinBoard,verifyController.checkBoardExistence,boardController.deleteBoard);

module.exports = router;
