const car = require("../models/cars");
const user = require("../models/users");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const notSearch = require("../helper/Filter")

exports.getCars = async (req, res) => {
  let { search, page, limit, sdate, edate } = req.query
  sdate = (sdate) ? sdate : "2020-02-02"
  edate = (edate) ? edate : "3020-02-02"

  let start = new Date([sdate, "03:00:00"])
  let end= new Date([edate, "24:00:00"])

  end = new Date(end.getTime() +  3 * 60 * 60 * 1000);

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const regex = new RegExp(search, "i")
  const skip = notSearch(page)(limit)
  const searchDB = {
    $and: [
      { modeName: { $regex: regex } },
      { userGiven: req.params.Id },
      {
        date: {
          $gte: start,
          $lte: end
        }
      },
    ]
  }


 let totalItems = await car.find(searchDB).countDocuments();
  car.find(searchDB)
    .select({ __v: 0, date: 0, userGiven: 0, carCost: 0, arrived: 0 })
    .limit(limit)
    .skip(skip)
    .then((data) => {
      if (data.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        carList: data,
        total: totalItems
      });
    }).catch(e => {
      res.status(500).json({
        message: "Internal Server Error",
      });
    })
};

exports.getRCarById = (req, res) => {
  car.findById(req.params.Id)
    .select({ __v: 0, date: 0, userGiven: 0, carCost: 0, arrived: 0 })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        carDetail: data
      });
    }).catch(e => {
      res.status(500).json({
        message: "Internal Server Error" + e
      });
    })
};

exports.updateCar = async (req, res) => {
  try {
    const params = JSON.parse(req.params.grant);
    const carDoc = await
      car
        .findOne({ _id: params.carId })
    if (!carDoc) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    carDoc.userGiven = params.userId;
    upCar = await carDoc.save();
    res.status(200).json({
      message: "Car is given to the Resaller",
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.deleteCar = async (req, res) => {
  try {
    const id = req.params.Id;

    const carDoc = await car.findOne({ _id: id });
    if (!carDoc) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    carDoc.userGiven = undefined;
    carDoc.save();

    res.status(204).json({});
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
