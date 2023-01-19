const mongoose = require("mongoose");
const exchange = require("../models/exchange");
const notsearch = require("../helper/Filter")

exports.getExchnage = async (req, res) => {
    let { page, limit } = req.query
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = notsearch(page)(limit)

    const total = await exchange.find().countDocuments();

    try {
        const getDocs = await exchange
            .find()
            .sort({ actionDate: -1 })
            .skip(skip)
            .limit(limit)
            .select({ __v: 0 })

        if (getDocs == null) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json(
            {
                costDetail: getDocs,
                total: total
            }
        );
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.createExchnage = async (req, res) => {
    const addExchange = new exchange({
        _id: mongoose.Types.ObjectId(),
        USD: req.body.USD,
        DEC: req.body.DEC,
    });

    addExchange
        .save()
        .then((out) => {
            res.status(201).json({
                message: "Exchange has been created"
            });
        })
        .catch((e) => {
            return res.status(500).json({
                message: "Internal Server Error"
            });
        });

};

exports.updateExchnage = async (req, res) => {

    const id = req.params.Id
    updateopcost = {
        USD: req.body.USD,
        DEC: req.body.DEC,
    }

    try {

        updateCost = await exchange.findOneAndUpdate(
            { _id: id },
            { $set: updateopcost },
            { new: true }
        );
        res.status(200).json({
            costDetail: updateCost
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internl Server Error"
        });
    }
};

exports.deleteExchnage = async (req, res) => {
    const id = req.params.Id;
    exchange.findOneAndDelete({ _id: id }, async (err, docs) => {
        if (err) {
            return res.status(400).json({
                message: "Bad Request"
            });
        } else if (docs) {
            res.status(204).json({});
        } else {
            return res.status(500).json({
                message: "Internl Server Error"
            });
        }
    });
};
