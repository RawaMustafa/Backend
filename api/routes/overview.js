const router = require('express').Router();
const controller = require('../controllers/costOverview');
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/',
    // authn,authr.isAdmin,
    controller.getTotalGN);
router.get('/qarz',
    // authn,
    // authr.isAdmin,
    controller.getTotalOwe);
router.get('/ownCost',
    // authn,authr.isAdmin,
    controller.getTotalOwen);
// <<<<<<< HEAD
// =======


router.get('/report',
    // authn,authr.isAdmin,
    controller.getCostReport);

// >>>>>>> ff0c54d (17/12)
module.exports = router
