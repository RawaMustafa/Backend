const router = require('express').Router();
const controller = require('../controllers/qars');
const car = require("../models/cars");
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

// <<<<<<< HEAD
router.get('/details/:Id', authn, authr.isQarz, validation._Id, controller.getDQarsCar);
router.get('/amount/:Id',
// authn,
//  authr.isQarz,
// =======
router.get('/details/:Id', authn, authr.isQarz,
 validation._Id, controller.getDQarsCar);
router.get('/amount/:Id', authn,authr.isQarz,
// >>>>>>> ff0c54d (17/12)
  validation._Id,
  validation.dateFormat,
   controller.getQarsAmountByUserID);
router.get('/isSold/:bool', authn, authr.isQarz, validation._Id, validation.search,validation.dateFormat, controller.getQarsIsSoled);
// <<<<<<< HEAD
router.get('/:Id',
//  authn, authr.isQarz,
  validation._Id, validation.search,validation.dateFormat, controller.getQarsByUserID);
router.post('/',
//  authn, authr.isAdmin,
// =======
router.get('/:Id', authn, authr.isQarz,
  validation._Id, validation.search,validation.dateFormat, controller.getQarsByUserID);
router.post('/',authn, authr.isAdmin,
// >>>>>>> ff0c54d (17/12)
  validation.qarzPost, controller.createQars);
router.patch('/:Id', authn, authr.isAdmin, validation.qarzUpdate, controller.updateQars);
router.delete('/:Id', authn, authr.isAdmin, validation._Id, controller.deletePerQars);

module.exports = router
