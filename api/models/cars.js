
const mongoose = require('mongoose')

const carSchema = mongoose.Schema({ 
    _id: mongoose.Schema.Types.ObjectId,
    price: Number,
    sellerCar: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isSold: Boolean, 
    modeName: { type: String, default: 'No Data' },
    model: String,
    color: String,
    isShipping: Boolean,
    mileage: String,
    VINNumber: String,
    wheelDriveType: String,
    tocar: String,
    tobalance: String,
    tire: String,
    Location:String,
    date: { type: Date, default: Date.now, get: dateFormat },
    arrivedToKurd: Boolean,
    arrivedToDoubai: Boolean,
    userGiven: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pictureandvideodamage: {

        type: [],
        default: undefined
    },

    pictureandvideorepair: {

        type: [],
        default: undefined
    },
    carOver: String,
    carDamage: {

        type: [],
        default: undefined
    },
    FirstImage: {

        type: [],
        default: undefined
    },
    carCost: { type: mongoose.Schema.Types.ObjectId, ref: 'CostPlusPricing' },
}, { toJSON: { getters: true } });

function dateFormat(date) {
    return date ? date.toJSON().split("T")[0] : (new Date()).toJSON().split("T")[0];
}
module.exports = mongoose.model('Cars', carSchema)
