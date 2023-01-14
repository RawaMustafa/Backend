const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CPrice: { type: Number, default: 0 },

});

module.exports = mongoose.model('Currency', userSchema);