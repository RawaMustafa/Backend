
const mongoose = require('mongoose')

const ex = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    USD: String,
    DEC: String,
    Symb: String,
    date: { type: Date, default: Date.now, get: dateFormat },

}, { toJSON: { getters: true } });

function dateFormat(date) {
    return date ? date.toJSON().split("T")[0] + " " + date.toTimeString().split(":")[0] + ":" + date.toTimeString().split(":")[1] : (new Date()).toJSON().split("T")[0] + " " + (new Date()).toTimeString().split(" ")[0];
}
module.exports = mongoose.model('Exchange', ex)
