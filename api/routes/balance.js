const router = require('express').Router();
const controller = require('../controllers/balance');
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/', authn, authr.isAdmin,
    validation.search, validation.dateFormat, controller.getBals);
router.get('/reseller',
    authn, authr.isAdmin,
    validation.search, validation.dateFormat, controller.getResellerBals);
router.get('/reseller/:Id', authn, authr.isAdmin,
    validation._Id, validation.search, validation.dateFormat, controller.getResellerBalsById);
router.get('/qarz', authn, authr.isAdmin,
    validation.search, validation.dateFormat, controller.getQarzBals);
router.get('/qarz/:Id',
    authn, authr.isAdmin,
    validation._Id, validation.search, validation.dateFormat, controller.getQarzBalsById);
router.get('/:Id',
    authn,
    // authr.isAdmin,
    validation._Id, validation.search, validation.dateFormat, controller.getBalByID);
router.get('/detail/:Id', authn, authr.isAdmin, validation._Id, controller.getByID);
router.post('/', authn,
    authr.isAdmin,
    validation.history, controller.createBal);
router.patch('/:Id', authn, authr.isAdmin, validation.historyUpdate, controller.updateBal);
router.delete('/:Id', authn, authr.isAdmin, validation._Id, controller.deleteBal);

module.exports = router
