const express =require('express');
const listController=require('../controller/listController');
const cardRouter = require('./cardRouter')

const router =express.Router({mergeParams:true});

router.use('/:listId/card',cardRouter);

router
  .route('/')
  .get(listController.getAllLists)
  .post(listController.createList);

router
  .route('/:id')
  .get(listController.getList)
  .patch(listController.updateList)
  .delete(listController.deleteList);

module.exports = router;
