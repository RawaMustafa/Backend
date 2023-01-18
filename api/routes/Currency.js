const router = require('express').Router();
// const controller = require('../controllers/Currency')
const validation = require('../validation/validate')
const controller = require('../controllers/Currency')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/',
    //  authn,
    //  authr.isAdmin, 
    validation.search, validation.dateFormat, controller.getCurrency);
// router.patch('/:Id', authn, authr.isAdmin, validation._Id, validation.costUpdate, controller.updateCost);
router.post('/',

    // authn, authr.isAdmin, validation._Id,
    controller.createCurrency);

module.exports = router
