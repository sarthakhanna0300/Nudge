const express =require('express');
const listController=require('../controller/listController');
const verifyController=require('../controller/verifyController');
const cardRouter = require('./cardRouter');

const router =express.Router({mergeParams:true});

router.use(verifyController.checkOwnerinBoard);
router.use(verifyController.checkBoardExistence);
router.use('/:listId/card',cardRouter);

router
  .route('/')
  .get(listController.getAllLists)
  .post(listController.createList);

router
  .route('/:listId')
  .get(verifyController.checkListExistence,verifyController.checkListinBoard,listController.getList)
  .patch(verifyController.checkListExistence,verifyController.checkListinBoard,listController.updateList)
  .delete(verifyController.checkListExistence,verifyController.checkListinBoard,listController.deleteList);

module.exports = router;
