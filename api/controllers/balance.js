const bal = require('../models/balances')
const mongoose = require('mongoose')
const notSearch = require('../helper/Filter')


exports.getBals = async (req, res) => {


    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { "user.userName": { $regex: regex } },
            // { isPaid: { $exists: false } },
            // { isSoled: { $exists: false } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {


        const getTotal = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: searchDB
            },
            { $count: "total" }
        ]);
        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $sort: { actionDate: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $sort: { actionDate: -1 } },
            {
                $group: {
                    _id: null,
                    carList: {
                        $push: {
                            userName: '$user.userName', action: '$action', actionDate: '$actionDate', note: '$note', userRole: '$user.userRole'
                            , amount: '$amount', factor: '$factor', VINNumber: '$car.VINNumber', userid: '$userId', carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id'
                        }
                    }

                }
            }

        ]);


        [{ total }] = getTotal;
        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0],
                userId: carList[item].userid,
                _id: carList[item]._id,
                VINNumber: carList[item].VINNumber[0],
                amount: carList[item].amount,
                factor: carList[item].factor,
                carId: carList[item].carid[0],
                modeName: carList[item].car_modeName[0],
                action: carList[item].action,
                note: carList[item].note,
                actionDate: (carList[item].actionDate).toJSON().split("T")[0],
                actionDate1: (carList[item].actionDate).toJSON().replace('T', ' ').split(':')[0] + ':' + (carList[item].actionDate).toJSON().replace('T', ' ').split(':')[1],

            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

exports.getBalByID = async (req, res) => {

    let { page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { userId: req.params.Id },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {
        const total = await bal.find(searchDB).countDocuments();
        const balHistory = await bal
            .find(searchDB)
            .sort({ actionDate: -1 })
            .limit(limit)
            .skip(skip)
            .select({ userId: 0, __v: 0 })
            .populate('carId')

        if (balHistory.length < 1) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json({
            History: balHistory,
            total: total
        })
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

exports.createBal = async (req, res) => {
    addBal = new bal({
        _id: mongoose.Types.ObjectId(),
        amount: req.body.amount,
        factor: req.body.Factor,
        carId: req.body.carId,
        userId: req.body.userId,
        action: req.body.action,
        note: req.body.note,
        isSoled: req.body.isSoled,
        isPaid: req.body.isPaid
    })

    addBal
        .save()
        .then(doc => {
            res.status(200).json({
                message: "history added"
            })
        })
        .catch(err =>
            res.status(500).json({
                erro: err
            }))
}

exports.updateBal = async (req, res, next) => {

    const id = req.params.Id

    const updateops = {
        factor: req.body.Factor,
        amount: req.body.amount,
        carId: req.body.carId,
        userId: req.body.userId,
        action: req.body.action,
        note: req.body.note
    }

    updateQars = await bal.findOneAndUpdate({ _id: id }, { $set: updateops }, { new: true })


    res.status(200).json({

        detail: updateQars

    })

}

exports.deleteBal = async (req, res, next) => {

    const id = req.params.Id

    bal.deleteOne({ _id: id })
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

/// Reseller Sectoin ////

exports.getResellerBals = async (req, res) => {

    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { "user.userName": { $regex: regex } },
            { isSoled: { $exists: true } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {


        const getTotal = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: searchDB
            },
            { $count: "total" }
        ]);
        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $sort: { actionDate: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    carList: {
                        $push: {
                            userName: '$user.userName', action: '$action', actionDate: '$actionDate', note: '$note'
                            , isSoled: '$isSoled', VINNumber: '$car.VINNumber', userid: '$userId', carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id'
                        }
                    }

                }
            }

        ]);


        [{ total }] = getTotal;
        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0],
                userId: carList[item].userid,
                _id: carList[item]._id,
                note: carList[item].note,
                isSoled: carList[item].isSoled,
                carId: carList[item].carid[0],
                modeName: carList[item].car_modeName[0],
                VINNumber: carList[item].VINNumber[0],
                action: carList[item].action,
                actionDate: (carList[item].actionDate).toJSON().split("T")[0]
            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

exports.getResellerBalsById = async (req, res) => {

    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { userId: mongoose.Types.ObjectId(req.params.Id) },
            { isSoled: { $exists: true } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }
    try {
        const getTotal = await bal.find(searchDB).countDocuments();

        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $skip: skip },
            { $sort: { actionDate: -1 } },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    carList: {
                        $push: {
                            userName: '$user.userName', action: '$action', actionDate: '$actionDate', note: '$note', VINNumber: '$car.VINNumber',
                            isSoled: '$isSoled', userid: '$userId', carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id'
                        }
                    }

                }
            }

        ]);

        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0], userId: carList[item].userid, _id: carList[item]._id, note: carList[item].note,
                isSoled: carList[item].isSoled, carId: carList[item].carid[0], modeName: carList[item].car_modeName[0], VINNumber: carList[item].VINNumber[0],
                action: carList[item].action, actionDate: (carList[item].actionDate).toJSON().split("T")[0]
            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}


exports.getQarzBals = async (req, res) => {

    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { "user.userName": { $regex: regex } },
            { isPaid: { $exists: true } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }

    try {


        const getTotal = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: searchDB
            },
            { $count: "total" }
        ]);
        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $skip: skip },
            { $sort: { actionDate: -1 } },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    carList: {
                        $push: {
                            userName: '$user.userName', action: '$action', actionDate: '$actionDate'
                            , isPaid: '$isPaid', userid: '$userId', 
                            amount: "$amount", 
                            factor: "$factor", 
                            note: '$note', VINNumber: '$car.VINNumber',
                            carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id'

                        }
                    }

                }
            }

        ]);


        [{ total }] = getTotal;
        [{ _id, carList }] = getQarz;

        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0], userId: carList[item].userid, _id: carList[item]._id, note: carList[item].note,
                isPaid: carList[item].isPaid, carId: carList[item].carid[0], modeName: carList[item].car_modeName[0], VINNumber: carList[item].VINNumber[0],
                action: carList[item].action, actionDate: (carList[item].actionDate).toJSON().split("T")[0],
                 amount: carList[item].amount,
                 factor: carList[item].factor
            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}

exports.getQarzBalsById = async (req, res) => {

    let carList, cars = [];

    let { search, page, limit, sdate, edate } = req.query

    var startDate = (sdate) ? sdate : '2020-10-10';
    var endDate = (edate) ? edate : '3000-10-10';
    const start = new Date([startDate, "03:00:00"])
    const end = new Date([endDate, "24:00:00"])

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const regex = new RegExp(search, "i")
    const skip = notSearch(page)(limit)

    const searchDB = {
        $and: [
            { userId: mongoose.Types.ObjectId(req.params.Id) },
            { isPaid: { $exists: true } },
            {
                actionDate: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    }
    try {
        const getTotal = await bal.find(searchDB).countDocuments();

        if (getTotal < 1) {
            return res.status(404).json({
                message: "Not Found"
            });
        }

        const getQarz = await bal.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $match: searchDB
            },
            { $skip: skip },
            { $sort: { actionDate: -1 } },
            { $limit: limit },
            {
                $group: {
                    _id: null,
                    carList: {
                        $push: {
                            userName: '$user.userName', action: '$action', actionDate: '$actionDate'
                            , isPaid: '$isPaid', userid: '$userId', 
                            amount: "$amount", 
                            factor: "$factor", 
                            note: '$note',
                            carid: '$car._id', car_modeName: '$car.modeName', _id: '$_id', VINNumber: '$car.VINNumber'

                        }
                    }

                }
            }

        ]);

        [{ _id, carList }] = getQarz;


        for (var item in carList) {
            cars[item] = {
                userName: carList[item].userName[0], userId: carList[item].userid, _id: carList[item]._id, note: carList[item].note,
                isPaid: carList[item].isPaid, carId: carList[item].carid[0], modeName: carList[item].car_modeName[0], VINNumber: carList[item].VINNumber[0],
                action: carList[item].action, actionDate: (carList[item].actionDate).toJSON().split("T")[0], 
                amount: carList[item].amount,
                factor: carList[item].factor
            }
        }


        res.status(200).json({
            History: cars,
            total: getTotal

        })
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
}



exports.getByID = async (req, res) => {


    try {
        const balHistory = await bal
            .findById(req.params.Id)
            .select({ userId: 0, __v: 0 })
            .populate('carId userId')

        if (!balHistory) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        res.status(200).json({
            History: balHistory,
        })
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
