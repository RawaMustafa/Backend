const cost = require('../models/costs')
const qarz = require('../models/qars')
const car = require('../models/cars')
const mongoose = require('mongoose')

exports.getTotalGN = async (req, res) => {
  try {
    let sum = 0;
    let bnft = 0;
    const { currency } = req.query;
    if (currency == "DEC") {

      const getAll = await cost.aggregate([
        {
          $group: {
            _id: null,
            totalpricePaidbid: { $sum: { $multiply: ["$pricePaidbid", "$factor"] } },
            totalCoCCost: { $sum: { $multiply: ["$coCCost", "$factor"] } },
            totalTransportationCost: {
              $sum: {
                $sum: [
                  { $multiply: ["$transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$factor"] },
                  { $multiply: ["$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostTranscost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostgumrgCost", "$factor"] },
                ]
              }
            },
            totalFeesinAmerica: {
              $sum: {
                $sum: [
                  { $multiply: ["$feesinAmericaStoragefee", "$factor"] },
                  { $multiply: ["$feesinAmericaCopartorIAAfee", "$factor"] }
                ]
              }
            },
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum: [
                  { $multiply: ["$feesAndRepaidCostDubairepairCost", "$factor"] },
                  { $multiply: ["$feesAndRepaidCostDubaiFees", "$factor"] },
                  { $multiply: ["$feesAndRepaidCostDubaiothers", "$factor"] },

                ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum: [
                  { $multiply: ["$raqamAndRepairCostinKurdistanrepairCost", "$factor"] },
                  { $multiply: ["$raqamAndRepairCostinKurdistanothers", "$factor"] },
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
          }
        }
      ])

      const [getpriceSold] = await cost.aggregate([
        { $match: { isSold: true } },
        {
          $group: {
            _id: null,
            totlPrice: { $sum: { $multiply: ["$price", "$factor"] } }
          }
        }
      ])

      const [getCostSold] = await cost.aggregate([
        { $match: { isSold: true } },
        {
          $group: {
            _id: null,
            totalpricePaidbid: { $sum: { $multiply: ["$pricePaidbid", "$factor"] } },
            totalCoCCost: { $sum: { $multiply: ["$coCCost", "$factor"] } },
            totalTransportationCost: {
              $sum: {
                $sum: [
                  { $multiply: ["$transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$factor"] },
                  { $multiply: ["$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostTranscost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostgumrgCost", "$factor"] },
                ]
              }
            },
            totalFeesinAmerica: {
              $sum: {
                $sum: [
                  { $multiply: ["$feesinAmericaStoragefee", "$factor"] },
                  { $multiply: ["$feesinAmericaCopartorIAAfee", "$factor"] }
                ]
              }
            },
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum: [
                  { $multiply: ["$feesAndRepaidCostDubairepairCost", "$factor"] },
                  { $multiply: ["$feesAndRepaidCostDubaiFees", "$factor"] },
                  { $multiply: ["$feesAndRepaidCostDubaiothers", "$factor"] },

                ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum: [
                  { $multiply: ["$raqamAndRepairCostinKurdistanrepairCost", "$factor"] },
                  { $multiply: ["$raqamAndRepairCostinKurdistanothers", "$factor"] },
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])
      const [getTCostQarz] = await qarz.aggregate([
        {
          $lookup: {
            from: "costpluspricings",
            localField: "carCost",
            foreignField: "_id",
            as: "cost"
          }
        },
        { '$unwind': { 'path': '$cost', 'preserveNullAndEmptyArrays': true } },
        {
          $group: {
            _id: null,
            TCostQarz: {
              $sum:
              {
                $sum: [

                  { $multiply: ["$cost.pricePaidbid", "$cost.factor"] },
                  { $multiply: ["$cost.feesinAmericaStoragefee", "$cost.factor"] },
                  { $multiply: ["$cost.feesinAmericaCopartorIAAfee", "$cost.factor"] },
                  { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$cost.factor"] },
                  { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$cost.factor"] },

                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }

      ]);


      const [getShipping] = await cost.aggregate([
        { $match: { isShipping: true } },
        {
          $group: {
            _id: null,
            shipping: {
              $sum: {
                $sum: [
                  { $multiply: ["$coCCost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostgumrgCost", "$factor"] },
                  { $multiply: ["$dubaiToIraqGCostTranscost", "$factor"] },
                ]
              }
            },
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])

      if (getAll.length < 1 && !getpriceSold) {
        return res.status(404).json({
          message: "Not Found",
        });
      }

      if (getCostSold)
        for (const props in getCostSold) {
          sum += getCostSold[props]
        }

      if (getpriceSold)
        bnft = getpriceSold.totlPrice - sum
      if (getAll) {
        getAll[0].totalbenefit = bnft;
        getAll[0].totalpriceSold = getpriceSold?.totlPrice
        getAll[0].totalCostSold = sum
        getAll[0].carNumber = await car.countDocuments();
        getAll[0].totalCostQarzCar = getTCostQarz?.TCostQarz;
        getAll[0].totalShipping = getShipping?.shipping;
      }
      res.status(200).json({
        TotalList: getAll,
      })
    } else {
      const getAll = await cost.aggregate([
        {
          $group: {
            _id: null,
            totalpricePaidbid: { $sum: "$pricePaidbid" },
            totalCoCCost: { $sum: "$coCCost" },
            totalTransportationCost: {
              $sum: {
                $sum: [
                  { $sum: "$transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                  { $sum: "$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" },
                  { $sum: "$dubaiToIraqGCostTranscost" },
                  { $sum: "$dubaiToIraqGCostgumrgCost" },
                ]
              }
            },
            totalFeesinAmerica: {
              $sum: {
                $sum: [
                  { $sum: "$feesinAmericaStoragefee" },
                  { $sum: "$feesinAmericaCopartorIAAfee" }
                ]
              }
            },
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum: [
                  { $sum: "$feesAndRepaidCostDubairepairCost" },
                  { $sum: "$feesAndRepaidCostDubaiFees" },
                  { $sum: "$feesAndRepaidCostDubaiothers" }
                ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum: [
                  { $sum: "$raqamAndRepairCostinKurdistanrepairCost" },
                  { $sum: "$raqamAndRepairCostinKurdistanothers" },
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
          }
        }
      ])

      const [getpriceSold] = await cost.aggregate([
        { $match: { isSold: true } },
        {
          $group: {
            _id: null,
            totlPrice: { $sum: "$price" }
          }
        }
      ])

      const [getCostSold] = await cost.aggregate([
        { $match: { isSold: true } },
        {
          $group: {
            _id: null,
            totalpricePaidbid: { $sum: "$pricePaidbid" },
            totalCoCCost: { $sum: "$coCCost" },
            totalTransportationCost: {
              $sum: {
                $sum: [
                  { $sum: "$transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                  { $sum: "$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" },
                  { $sum: "$dubaiToIraqGCostTranscost" },
                  { $sum: "$dubaiToIraqGCostgumrgCost" },
                ]
              }
            },
            totalFeesinAmerica: {
              $sum: {
                $sum: [
                  { $sum: "$feesinAmericaStoragefee" },
                  { $sum: "$feesinAmericaCopartorIAAfee" }
                ]
              }
            },
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum: [
                  { $sum: "$feesAndRepaidCostDubairepairCost" },
                  { $sum: "$feesAndRepaidCostDubaiFees" },
                  { $sum: "$feesAndRepaidCostDubaiothers" },

                ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum: [
                  { $sum: "$raqamAndRepairCostinKurdistanrepairCost" },
                  { $sum: "$raqamAndRepairCostinKurdistanothers" },
                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])
      const [getTCostQarz] = await qarz.aggregate([
        {
          $lookup: {
            from: "costpluspricings",
            localField: "carCost",
            foreignField: "_id",
            as: "cost"
          }
        },
        { '$unwind': { 'path': '$cost', 'preserveNullAndEmptyArrays': true } },
        {
          $group: {
            _id: null,
            TCostQarz: {
              $sum:
              {
                $sum: [

                  { $sum: "$cost.pricePaidbid" },
                  { $sum: "$cost.feesinAmericaStoragefee" },
                  { $sum: "$cost.feesinAmericaCopartorIAAfee" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" },

                ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }

      ]);


      const [getShipping] = await cost.aggregate([
        { $match: { isShipping: true } },
        {
          $group: {
            _id: null,
            shipping: { $sum: { $sum: ["$coCCost", "$dubaiToIraqGCostgumrgCost", "$dubaiToIraqGCostTranscost"] } },
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])

      if (getAll.length < 1 && !getpriceSold) {
        return res.status(404).json({
          message: "Not Found",
        });
      }

      if (getCostSold)
        for (const props in getCostSold) {
          sum += getCostSold[props]
        }

      if (getpriceSold)
        bnft = getpriceSold.totlPrice - sum
      if (getAll) {
        getAll[0].totalbenefit = bnft;
        getAll[0].totalpriceSold = getpriceSold?.totlPrice
        getAll[0].totalCostSold = sum
        getAll[0].carNumber = await car.countDocuments();
        getAll[0].totalCostQarzCar = getTCostQarz?.TCostQarz;
        getAll[0].totalShipping = getShipping?.shipping;
      }
      res.status(200).json({
        TotalList: getAll,
      })
    }
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}


exports.getTotalOwe = async (req, res) => {
  try {
    const { currency } = req.query;

    if (currency == "DEC") {
      const getQarz = await qarz.aggregate([

        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "car"
          }
        },
        {
          $lookup: {
            from: "costpluspricings",
            localField: "carCost",
            foreignField: "_id",
            as: "cost"
          }
        },
         { $match: { isPaid: false } },
        { '$unwind': { 'path': '$cost', 'preserveNullAndEmptyArrays': true } },
        {
          $group: {
            _id: null,
            qarzCarTotal:
            {
              $sum:
              {
                $sum: [
                  { $multiply: ["$cost.pricePaidbid", "$cost.factor"] },
                  { $multiply: ["$cost.feesinAmericaStoragefee", "$cost.factor"] },
                  { $multiply: ["$cost.feesinAmericaCopartorIAAfee", "$cost.factor"] },
                  { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$cost.factor"] },
                  { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$cost.factor"] },
                ]
              }
            },
            qarzAmountTotal: {
              $sum: { $multiply: ["$qarAmount", "$factor"] }
            },
            qarzTotal: {
              $sum: {
                $sum:
                  [
                    { $multiply: ["$cost.pricePaidbid", "$cost.factor"] },
                    { $multiply: ["$cost.feesinAmericaStoragefee", "$cost.factor"] },
                    { $multiply: ["$cost.feesinAmericaCopartorIAAfee", "$cost.factor"] },
                    { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$cost.factor"] },
                    { $multiply: ["$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$cost.factor"] },
                    { $multiply: ["$qarAmount", "$factor"] }
                  ]
              }
            },
          },

        }
        , {
          $project: {
            _id: 0,
            qarzCarTotalByAmount: "$qarzCarTotal",
            qarzAmountTotal: "$qarzAmountTotal",
            qarzTotal: "$qarzTotal",
          }
        }

      ])
      if (getQarz.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getQarz
      })
    } else { 

      const getQarz = await qarz.aggregate([
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "car"
          }
        },
        {
          $lookup: {
            from: "costpluspricings",
            localField: "carCost",
            foreignField: "_id",
            as: "cost"
          }
        },
        { $match: { isPaid: false } },
        { '$unwind': { 'path': '$cost', 'preserveNullAndEmptyArrays': true } },
        {
          $group: {
            _id: null,
            qarzCarTotal:
            {
              $sum:
              {
                $sum: [
                  { $sum: "$cost.pricePaidbid" },
                  { $sum: "$cost.feesinAmericaStoragefee" },
                  { $sum: "$cost.feesinAmericaCopartorIAAfee" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" },
                ]
              }
            },
            qarzAmountTotal: { $sum: "$qarAmount"},
         
          qarzTotal: {
            $sum: {
              $sum:
                [
                  { $sum: "$cost.pricePaidbid" },
                  { $sum: "$cost.feesinAmericaStoragefee" },
                  { $sum: "$cost.feesinAmericaCopartorIAAfee" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                  { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" },
                  { $sum: "$qarAmount" }
                ]
            }
          },
        }
        },
        {
          $project: {
            _id: 0,
            qarzCarTotalByAmount: "$qarzCarTotal",
            qarzAmountTotal: "$qarzAmountTotal",
            qarzTotal: "$qarzTotal",
          }
        }
      ])

      if (getQarz.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getQarz
      })
    }
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error" + e
    });
  }
}


exports.getTotalOwen = async (req, res) => {

  try {
    const { currency } = req.query;

    if (currency == "DEC") {
      const getOwenCost = await cost.aggregate([
        {
          $group: {
            _id: null,
            owenCost: { $sum: { $multiply: ["$qarAmount", "$factor"] } }

          }
        },
        {
          $project: {
            _id: 0,
            owenCost: "$owenCost",
          }
        }
      ])
      if (getOwenCost.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getOwenCost
      })
    }
    else {
      const getOwenCost = await cost.aggregate([
        {
          $group: {
            _id: null,
            owenCost: { $sum: "$qarAmount" }

          }
        },
        {
          $project: {
            _id: 0,
            owenCost: "$owenCost",
          }
        }
      ])
      if (getOwenCost.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getOwenCost
      })

    }
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}



exports.getCostReport = async (req, res) => {
  try {

    let { sdate, edate, currency } = req.query
    sdate = (sdate) ? sdate : "2020-02-02"
    edate = (edate) ? edate : "3020-02-02"
    let start = new Date([sdate, "00:00:00"])
    let end = new Date([edate, "24:00:00"])

    if (currency == "DEC") {
      const [getCostSold] = await cost.aggregate([
        {
          $match:
          {
            $and: [
              { isSold: false },
              {
                actionDate: {
                  $gte: start,
                  $lte: end
                }
              }
            ]
          }
        },
        {
          $group: {
            _id: null,
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum:
                  [
                    { $multiply: ["$feesAndRepaidCostDubairepairCost", "$factor"] },
                    { $multiply: ["$feesAndRepaidCostDubaiFees", "$factor"] },
                    { $multiply: ["$feesAndRepaidCostDubaiothers", "$factor"] },
                  ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum:
                  [
                    { $multiply: ["$raqamAndRepairCostinKurdistanrepairCost", "$factor"] },
                    { $multiply: ["$raqamAndRepairCostinKurdistanothers", "$factor"] },
                  ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])


      if (getCostSold?.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getCostSold
      })
    } else {
      const [getCostSold] = await cost.aggregate([
        {
          $match:
          {
            $and: [
              { isSold: false },
              {
                actionDate: {
                  $gte: start,
                  $lte: end
                }
              }
            ]
          }
        },
        {
          $group: {
            _id: null,
            totalFeesAndRepaidCostDubai: {
              $sum: {
                $sum:
                  [
                    { $sum: "$feesAndRepaidCostDubairepairCost" },
                    { $sum: "$feesAndRepaidCostDubaiFees" },
                    { $sum: "$feesAndRepaidCostDubaiothers" },
                  ]
              }
            },
            totalFeesRaqamAndRepairCostinKurdistan: {
              $sum: {
                $sum:
                  [
                    { $sum: "$raqamAndRepairCostinKurdistanrepairCost" },
                    { $sum: "$raqamAndRepairCostinKurdistanothers" },
                  ]
              }
            }
          }
        },
        {
          $project: {
            _id: 0
          }
        }
      ])


      if (getCostSold?.length < 1) {
        return res.status(404).json({
          message: "Not Found"
        });
      }
      res.status(200).json({
        QarzTotal: getCostSold
      })
    }
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error" + e
    });
  }
}
