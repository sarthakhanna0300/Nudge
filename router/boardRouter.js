const express =require('express');
const boardController = require('../controller/boardController.js');
const listRouter = require('./listRouter');
const cardRouter = require('./cardRouter');
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
  .get(verifyController.checkBoardExistence,boardController.getBoard)
  .patch(verifyController.checkBoardExistence,boardController.updateBoard)
  .delete(verifyController.checkBoardExistence,boardController.deleteBoard);

module.exports = router;
