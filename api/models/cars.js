
const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: Number,
    sellerCar: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
<<<<<<< HEAD
    isSold: Boolean, 
=======
    isSold: Boolean,
>>>>>>> ff0c54d (17/12)
    modeName: { type : String, default : 'No Data'},
    model: Number,
    color: String, 
    mileage: String,
    VINNumber: String,
    wheelDriveType: String,
    tocar: String,
    tobalance: String,
    tire: String,
    date:{ type: Date, default: Date.now, get: dateFormat },
    arrivedToKurd: Boolean,
    arrivedToDoubai: Boolean,
    userGiven: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    pictureandvideodamage:{

        type:[],
        default:undefined
    },

    pictureandvideorepair: {

        type:[],
        default:undefined
    },
    carOver: String,
    carDamage: {
    
        type:[],
        default:undefined
    },
    FirstImage: {

        type:[],
        default:undefined
    },
    carCost: { type: mongoose.Schema.Types.ObjectId, ref : 'CostPlusPricing'},
}, {toJSON: {getters: true}});

function dateFormat(date) {
  return date ? date.toJSON().split("T")[0] : (new Date()).toJSON().split("T")[0];
}
<<<<<<< HEAD
module.exports = mongoose.model('Cars', carSchema) 
=======
module.exports = mongoose.model('Cars', carSchema)
>>>>>>> ff0c54d (17/12)
