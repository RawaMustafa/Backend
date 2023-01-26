const router = require('express').Router();
// const controller = require('../controllers/cars')
const validation = require('../validation/validate')
const controller = require('../controllers/exchange')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')
router.get('/',
  authn,
  authr.isAdmin,
  validation.search, validation.dateFormat, controller.getExchnage);

router.post('/',
  authn, authr.isAdmin,
  // validation.costPost,
  controller.createExchnage);
router.patch('/:Id',
  authn, authr.isAdmin, validation._Id, validation.costUpdate,
  controller.updateExchnage);
router.delete('/:Id',
  authn, authr.isAdmin, validation._Id,
  controller.deleteExchnage);

module.exports = router
