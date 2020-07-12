const express =require('express');
const boardController = require('../controller/boardController.js');
const listRouter = require('./listRouter');
const cardRouter = require('./cardRouter');

const router =express.Router();

router.use('/:boardId/list',listRouter);

router
  .route('/')
  .get(boardController.getAllBoards)
  .post(boardController.createBoard);

router
  .route('/:id')
  .get(boardController.getBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
