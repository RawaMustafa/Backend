const car = require("../models/cars");
const qars = require('../models/qarziB')
const mongoose = require('mongoose')
const notSearch = require('../helper/Filter')

exports.getQarsB = async (req, res) => {

    let { search, sdate, edate, page, limit, isPaid, qarztype } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    let end = new Date([endDate, "24:00:00"])
    end = end.getTime() + (3 * 60 * 60 * 1000)
    end = new Date(end)
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = notSearch(page)(limit)
    isPaid = parseInt(isPaid, 10)
    qarztype = parseInt(qarztype, 10)

    const optionalQuery = {
        '2': {},
        '3': {},
    }

    isPaid = (!Number.isNaN(isPaid)) ? optionalQuery[2] = {
        isPaid: { $eq: isPaid }
    } : isPaid;
    qarztype = (!Number.isNaN(qarztype)) ? optionalQuery[3] = {
        qarzType: { $eq: qarztype }
    } : qarztype;
    const regex = new RegExp(search, "i")
    const searchDB = {
        $and: [
            optionalQuery[2],
            optionalQuery[3],
            {
                dates: {
                    $gte: start,
                    $lte: end
                }
            },
            { note: { $regex: regex } },
        ]
    }
    try {
        totalItems = await qars.find(searchDB).countDocuments();

        qars.find(searchDB)
            .sort({ dates: -1 })
            .select({ userId: 0, __v: 0, })
            .limit(limit)
            .skip(skip)
            .then(data => {
                if (data.length < 1) {
                    return res.status(404).json({
                        message: "Not Found"
                    });
                }
                res.status(200).json({
                    qarzList: data,
                    total: totalItems
                });

            }).catch(e => res.status(500).json({
                message: "Internal Server Error" + e
            }))
    } catch (e) {

        res.status(500).json({
            message: "Internal Server Error" + e
        })


    }
}


exports.createQars = async (req, res) => {
    try {
        const addQars = new qars({
            _id: mongoose.Types.ObjectId(),
            qarAmount: req.body.amount,
            qarzType: req.body.QarzType,
            factor: req.body.Factor,
            isPaid: req.body.isPaid,
            note: req.body.note,
        })

        addQars
            .save()
            .then(doc => {
                res.status(201).json({
                    message: "Qarz has been created"
                })
            }).catch(e => {
                res.status(500).json({
                    message: "Internal Server Error" + e
                })
            })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

exports.updateQars = async (req, res, next) => {

    try {
        const id = req.params.Id
        const updateops = {
            qarAmount: req.body.amount,
            qarzType: req.body.QarzType,
            factor: req.body.Factor,
            isPaid: req.body.isPaid,
            note: req.body.note,

        }
        updateQars = await qars
            .findOneAndUpdate({ _id: id }, { $set: updateops })
        if (!updateQars) {
            return res.status(404).json({
                message: "Not Found"
            });
        }
        res.status(200).json({
            Desc: 'Qars is Updated'
        })
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }

}

exports.deletePerQars = async (req, res) => {

    const id = req.params.Id

    qars.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount < 1) {
                return res.status(404).json({
                    message: "Not Found",
                });
            }
            res.status(204).json({});
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal Server Error"
            });
        });
}
