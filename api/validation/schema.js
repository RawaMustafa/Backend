const joi = require('joi')

// Predefine Data Input Pattern Section
const chWL = '[a-zA-Z0-9\\s ]+'
//.integer()
const num = joi.number().greater(-99999999999).less(99999999999).messages({
    'number.base': 'must be a string',
    'number.less': 'must be less than 9999',
    'number.greater': 'must be greater than 0'
})
const bool = joi.boolean().truthy(1).falsy(0).messages({
    'any.required': 'Required',
    'boolean.base': 'must be a [0 or 1]',

})
const str = joi.string().min(0).max(40).regex(new RegExp(`^[0-9a-zA-Z-_/.,$=  ]{0,40}`)).messages({
    'string.pattern.base': 'fails to match the required pattern',
    'any.required': 'Required',
    'string.base': 'must be a string',
    'string.min': 'Min 0 characteers',
    'string.max': 'MAX 40 characteers'
})
const _id = joi.string().length(24).required().regex(new RegExp(`^${chWL}$`)).messages({
    'string.pattern.base': 'fails to match the required pattern',
    'any.required': 'Required',
    'string.base': 'must be a string',
    'string.length': 'length must be 24 characters long',

})
const email = joi.string().min(7).max(30)
    .regex(new RegExp(
        "^[a-zA-Z0-9-_/., ]{4,20}@([a-z]{2,6}\.)+[a-z]{2,4}$"
    )).messages({
        'string.pattern.base': 'fails to match the required pattern',
        'any.required': 'Required',
        'string.base': 'must be a string',
        'string.min': 'Min 7 characteers',
        'string.max': 'MAX 30 characteers'
    })
const password = joi.string().min(4).max(30).regex(new RegExp('^[a-zA-Z0-9-_/.,  ]{4,16}')).messages({
    'string.pattern.base': 'fails to match the required pattern',
    'any.required': 'Required',
    'string.base': 'must be a string',
    'string.min': 'Min 4 characteers',
    'string.max': 'MAX 30 characteers'

})
const role = joi.string().regex(new RegExp('^(Reseller|Qarz|Admin)$')).messages({
    'string.pattern.base': 'Only Reseller or Qarz Allowed',
    'any.required': 'Required',
    'string.base': 'must be a string',
    'string.min': 'Min 7 characteers',
    'string.max': 'MAX 30 characteers'
})

const Date = joi.string().regex(new RegExp('^[0-9a-zA-Z-_/:;]{0,30}')).messages({
    'string.pattern.base': 'Date should be correct format'
})

// Car Section
exports.carSchemaPost = joi.object({

    Price: num,
    IsSold: bool,
    ModeName: str,
    Model: num,
    Color: str,
    Mileage: str,
    VINNumber: str,
    IsShipping: bool,
    WheelDriveType: str,
    Pictureandvideodamage: str,
    Pictureandvideorepair: str,
    CarDamage: str,
    FirstImage: str,
    PricePaidbid: num,
    UserGiven: _id.optional(),
    SellerCar: _id.optional(),
    Tocar: str,
    Location: str,
    Tobalance: str,
    Tire: str,
    Date: Date,
    selleNote: str,
    // ArrivedToKurd: bool,
    // ArrivedToDoubai: bool,
    FeesinAmericaStoragefee: num,
    FeesinAmericaCopartorIAAfee: num,
    FeesAndRepaidCostDubairepairCost: num,
    FeesAndRepaidCostDubaiFees: num,
    FeesAndRepaidCostDubaiothers: num,
    FeesAndRepaidCostDubainote: str,
    Factor: num,
    CoCCost: num,
    TransportationCostFromAmericaLocationtoDubaiGCostLocation: str,
    TransportationCostFromAmericaLocationtoDubaiGCostTranscost: num,
    TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost: num,
    DubaiToIraqGCostTranscost: num,
    DubaiToIraqGCostgumrgCost: num,
    RaqamAndRepairCostinKurdistanrepairCost: num,
    RaqamAndRepairCostinKurdistanRaqam: str,
    // RaqamAndRepairCostinKurdistanothers: num,
    RaqamAndRepairCostinKurdistannote: str
})


exports.carSchemaUpdate = joi.object({

    Price: num,
    IsSold: bool,
    ModeName: str,
    Model: num,
    Color: str,
    Mileage: str,
    VINNumber: str,
    WheelDriveType: str,
    Pictureandvideodamage: str,
    Pictureandvideorepair: str,
    CarDamage: str,
    FirstImage: str,
    PricePaidbid: num,
    IsShipping: bool,
    UserGiven: _id.optional(),
    SellerCar: _id.optional(),
    Tocar: str,
    Tobalance: str,
    Tire: str,
    Location: str,
    Date: Date.optional(),
    selleNote: str,
    // ArrivedToKurd: bool,
    // ArrivedToDoubai: bool,
    FeesinAmericaStoragefee: num,
    FeesinAmericaCopartorIAAfee: num,
    FeesAndRepaidCostDubairepairCost: num,
    // FeesAndRepaidCostDubaiFees: num,
    FeesAndRepaidCostDubaiothers: num,
    FeesAndRepaidCostDubainote: str,
    Factor: num,
    CoCCost: num,
    TransportationCostFromAmericaLocationtoDubaiGCostLocation: str,
    TransportationCostFromAmericaLocationtoDubaiGCostTranscost: num,
    TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost: num,
    DubaiToIraqGCostTranscost: num,
    DubaiToIraqGCostgumrgCost: num,
    RaqamAndRepairCostinKurdistanrepairCost: num,
    RaqamAndRepairCostinKurdistanRaqam: str,
    // RaqamAndRepairCostinKurdistanothers: num,
    RaqamAndRepairCostinKurdistannote: str
})

// User Section
exports.signup = joi.object({
    email: email.required(),
    userName: str.required(),
    password: password.required(),
    userRole: role.required(),
    TotalBals: num
})

exports.signupUpdate = joi.object({
    email: email,
    userName: str,
    password: password,
    TotalBals: num,
    status: bool,
    userRole: str

})

exports.userRole = joi.object({
    userRole: role
})

exports.loging = joi.object({
    email: email,
    password: password,
})

// Reseler Section
exports.grantCar = joi.object({
    userId: _id,
    carId: _id
})

// Qarz Section
exports.qarzPost = joi.object({
    amount: num,
    userId: _id,
    carId: _id.optional(),
    isPaid: bool,
    Factor: num.optional(),
    note: str,

}).xor('amount', 'carId').messages({
    'object.missing': 'must contain at least one of  [Amount or car] ',
    'object.xor': 'of [Amount or car] together not allowed'
})

exports.qarzUpdate = joi.object({
    amount: num,
    userId: _id.optional(),
    carId: _id.optional(),
    isPaid: bool.optional(),
    Factor: num.optional(),
    note: str

}).nand('amount', 'carId').messages({
    'object.nand': 'of [Amount or car] together not allowed'
})

// History Section
exports.history = joi.object({
    amount: num,
    carId: _id.optional(),
    userId: str.optional(),
    action: str,
    isSoled: bool,
    isPaid: bool,
    note: str,
    Factor: num.optional(),


})
// .xor('amount', 'carId').messages({
// 'object.missing': 'must contain at least one of  [Amount or car] ',
// 'object.xor': 'of [Amount or car] together not allowed'
// })

exports.historyUpdate = joi.object({
    amount: num.optional(),
    carId: _id.optional(),
    userId: str.optional(),
    action: str,
    Factor: num.optional(),
    note: str,
}).xor('note', 'amount', 'carId').messages({
    'object.missing': 'must contain at least one of  [Amount or car] ',
    'object.xor': 'of [Amount or car] together not allowed'
})

// file section
exports.file_Id = joi.object({
    Id: joi.string().min(7).max(50).required()
        .regex(new RegExp(
            "^[a-zA-Z0-9-.]+$"
        )).messages({
            'string.pattern.base': 'fails to match the required pattern',
            'any.required': 'Required',
            'string.base': 'must be a string',
            'string.min': 'Min 7 characteers',
            'string.max': 'MAX 30 characteers'
        })
})

// Id section
exports._Id = joi.object({
    Id: _id
})

// date section
exports.date = joi.object({
    sdate: Date,
    edate: Date

})




// bool secion
exports.booleans = joi.object({
    bool: bool.truthy('1').falsy('0')
})

// search section
exports.search = joi.object({
    search: str.min(0).allow(null, '')
})

// cost section
exports.costPost = joi.object({
    cost: num,
    DESC: str,
    date: Date,
    symbol: str,
    Factor: num.optional(),

})

exports.costUpdate = joi.object({
    cost: num,
    DESC: str,
    date: Date,
    symbol: str,
    Factor: num.optional(),

})





exports.qarzBUpdate = joi.object({
    amount: num,
    QarzType: bool,
    Factor: num,
    isPaid: bool,
    note: str,

})

exports.qarzBPost = joi.object({
    amount: num,
    QarzType: bool,
    Factor: num,
    isPaid: bool,
    note: str,

})




