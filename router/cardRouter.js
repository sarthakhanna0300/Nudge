const express =require('express');
const cardController=require('../controller/cardController');
const verifyController=require('../controller/verifyController');
const router =express.Router({mergeParams:true});

router.use(verifyController.checkListExistence);
router.use(verifyController.checkListinBoard);

router
  .route('/')
  .get(cardController.getAllCards)
  .post(cardController.createCard);
  
router
  .route('/:cardId')
  .get(verifyController.checkCardExistence,verifyController.checkCardinList,cardController.getCard)
  .patch(verifyController.checkCardExistence,verifyController.checkCardinList,cardController.updateCard)
  .delete(verifyController.checkCardExistence,verifyController.checkCardinList,cardController.deleteCard);

module.exports = router;
