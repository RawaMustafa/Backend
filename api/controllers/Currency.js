const mongoose = require("mongoose");
const CurrencyPricee = require("../models/Currency");



exports.createCurrency = async (req, res) => {




    const CurrencyPrice = req.body.CurrencyPrice;


    const carCost = new CurrencyPricee({
        _id: mongoose.Types.ObjectId(),
        CPrice: CurrencyPrice,
    });


    carCost
        .save()
        .then((lastOut) => {
            res.status(201).json({
                message: "Car has been created",
                Id: lastOut._id
            });
        })
        .catch((e) => {
            return res.status(400).json({
                message: "Bad Request"
            });
        });

};


exports.getCurrency = async (req, res) => {

    try {
        const getCurrency = await CurrencyPricee.find()
            // .select({ __v: 0 })


        
        if (getCurrency == null) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json(
            {
                CurrencyPrice: getCurrency,
            }
        );
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


exports.updatePrice = async (req, res) => {

    const id = req.params.Id
    updateCurrency = {
        OtherCost: req.body.CurrencyPrice,
    }

    try {

        updatePrice = await CurrencyPrice.findOneAndUpdate(
            { _id: id },
            { $set: updateCurrency },
            { new: true }
        );
        res.status(200).json({
            costDetail: updatePrice
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internl Server Error"
        });
    }
};
