const router = require('express').Router();
const controller = require('../controllers/cars')
const validation = require('../validation/validate')
const authn = require('../middleware/check-auth')
const authr = require('../middleware/checkAuthr')

router.get('/', validation.dateFormat, controller.getCars);
router.get('/:Id', authn, authr.isAdmin, validation._Id, controller.getCarById);
router.post('/', authn, authr.isAdmin, validation.carPost, controller.createCar);
router.patch('/:Id',
    authn, authr.isAdmin,
    validation._Id,
    // validation.carUpdate,
    controller.updateCar
);

router.patch('/image/:Id',
    // authn, authr.isAdmin, 
    // validation._Id,
    // validation.carUpdate,
    controller.updateCarCurrentImage
);

router.patch('/PushImage/:Id',
    // authn, authr.isAdmin, 
    // validation._Id,
    // validation.carUpdate,
    controller.updatePushImage
);
router.delete('/:Id', authn, authr.isAdmin, validation._Id, controller.deleteCar);

module.exports = router
