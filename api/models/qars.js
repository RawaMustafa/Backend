const mongoose = require("mongoose")

const qars = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    qarAmount: Number,
    factor: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    carId: { type: mongoose.Schema.Types.ObjectId, ref : 'Cars'
  },
  carCost: { type: mongoose.Schema.Types.ObjectId, ref : 'CostPlusPricing'
},
    isPaid: Boolean,
    dates: { type: Date, default : Date.now, get: dateFormat}
}, {toJSON: {getters: true}})
function dateFormat(date) {
 
    return date?.toJSON()?.split("T")[0];
  }
module.exports = mongoose.model('Qarz', qars)
