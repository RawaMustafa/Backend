const mongoose = require("mongoose")

const qars = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  qarAmount: Number,
  factor: Number,
  isPaid: Boolean,
  note: String,
  qarzType: Boolean,
  dates: { type: Date, default: Date.now, get: dateFormat }
}, { toJSON: { getters: true } })
function dateFormat(date) {
  return date ? date.toJSON().split("T")[0] + " " + date.toTimeString().split(":")[0] + ":" + date.toTimeString().split(":")[1] : (new Date()).toJSON().split("T")[0] + " " + (new Date()).toTimeString().split(" ")[0];

}
module.exports = mongoose.model('QarzB', qars)