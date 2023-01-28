const router = require('express').Router();
const controller = require('../controllers/qarzB');
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/',
    authn, authr.isQarz,
    validation.search,
    validation.dateFormat,
    controller.getQarsB);

router.post('/',
    authn, authr.isAdmin,
    validation.qarzBPost,
    controller.createQars);
router.patch('/:Id',
    authn, authr.isAdmin,
    validation.qarzBUpdate,
    controller.updateQars);
router.delete('/:Id',
    authn, authr.isAdmin, validation._Id,
    controller.deletePerQars);

module.exports = router
