const { number } = require('joi')
const mongoose = require('mongoose')

const costSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  price: Number,
  factor: Number,
  isSold: Boolean,
  pricePaidbid: Number,
  feesinAmericaStoragefee: Number,
  feesinAmericaCopartorIAAfee: Number,
  feesAndRepaidCostDubairepairCost: Number,
  feesAndRepaidCostDubaiFees: Number,
  feesAndRepaidCostDubaiothers: Number,
  feesAndRepaidCostDubainote: String,
  coCCost: Number,
  isShipping: Boolean,
  transportationCostFromAmericaLocationtoDubaiGCostLocation: String,
  transportationCostFromAmericaLocationtoDubaiGCostTranscost: Number,
  transportationCostFromAmericaLocationtoDubaiGCostgumrgCost: Number,
  dubaiToIraqGCostTranscost: Number,
  dubaiToIraqGCostgumrgCost: Number,
  raqamAndRepairCostinKurdistanrepairCost: Number,
  raqamAndRepairCostinKurdistanRaqam: String,
  raqamAndRepairCostinKurdistanothers: Number,
  raqamAndRepairCostinKurdistannote: String,
  raqamAndRepairCostinKurdistannote: String,
  OtherCost: Number,
  DescCost: String,
  symbol: String,
  actionDate: { type: Date, default: Date.now, get: dateFormat },

}, { toJSON: { getters: true } })

function dateFormat(date) {
  return date ? date.toJSON().split("T")[0] + " " + date.toTimeString().split(":")[0] + ":" + date.toTimeString().split(":")[1] : (new Date()).toJSON().split("T")[0] + " " + (new Date()).toTimeString().split(" ")[0];

}


module.exports = mongoose.model('CostPlusPricing', costSchema)