const cost = require('../models/costs')
const qarz = require('../models/qars')
const car = require('../models/cars')
const mongoose = require('mongoose')

exports.getTotalGN = async (req, res) => {
  try {
    let sum = 0;
    let bnft = 0;

    const getAll = await cost.aggregate([
      {
        $group: {
          _id: null,
          totalpricePaidbid: { $sum: "$pricePaidbid" },
          totalCoCCost: { $sum: "$coCCost" },
          totalTransportationCost: { $sum: { $sum: ["$transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$dubaiToIraqGCostTranscost", "$dubaiToIraqGCostgumrgCost"] } },
          totalFeesinAmerica: { $sum: { $sum: ["$feesinAmericaStoragefee", "$feesinAmericaCopartorIAAfee"] } },
          totalFeesAndRepaidCostDubai: { $sum: { $sum: ["$feesAndRepaidCostDubairepairCost", "$feesAndRepaidCostDubaiFees", "$feesAndRepaidCostDubaiothers"] } },
          totalFeesRaqamAndRepairCostinKurdistan: { $sum: { $sum: ["$raqamAndRepairCostinKurdistanrepairCost", "$raqamAndRepairCostinKurdistanothers"] } }
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
          totalTransportationCost: { $sum: { $sum: ["$transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$dubaiToIraqGCostTranscost", "$dubaiToIraqGCostgumrgCost"] } },
          totalFeesinAmerica: { $sum: { $sum: ["$feesinAmericaStoragefee", "$feesinAmericaCopartorIAAfee"] } },
          totalFeesAndRepaidCostDubai: { $sum: { $sum: ["$feesAndRepaidCostDubairepairCost", "$feesAndRepaidCostDubaiFees", "$feesAndRepaidCostDubaiothers"] } },
          totalFeesRaqamAndRepairCostinKurdistan: { $sum: { $sum: ["$raqamAndRepairCostinKurdistanrepairCost", "$raqamAndRepairCostinKurdistanothers"] } }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])
    console.log(getCostSold)
    const [getTCostQarz] = await qarz.aggregate([
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
      {
        $group: {
          _id: null,
          TCostQarz: {
            $sum:
            {
              $sum: [
                { $sum: "$cost.coCCost" },
                { $sum: "$cost.feesinAmericaStoragefee" },
                { $sum: "$cost.feesinAmericaCopartorIAAfee" },
                { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" }
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
      getAll[0].totalCostQarzCar = getTCostQarz?.TCostQarz
    }
    res.status(200).json({
      TotalList: getAll,
    })
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}


exports.getTotalOwe = async (req, res) => {
  try {
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
      {
        $group: {
          _id: null,
          qarzCarTotal:
          {
            $sum:
            {
              $sum: [
                { $sum: "$cost.coCCost" },
                { $sum: "$cost.feesinAmericaStoragefee" },
                { $sum: "$cost.feesinAmericaCopartorIAAfee" },
                { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostTranscost" },
                { $sum: "$cost.transportationCostFromAmericaLocationtoDubaiGCostgumrgCost" }
              ]
            }
          },
          qarzAmountTotal: { $sum: "$qarAmount" },
          qarzTotal: {
            $sum: {
              $sum:
                [{ $sum: "$car.price" }, "$qarAmount"]
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
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error" + e
    });
  }
}


exports.getTotalOwen = async (req, res) => {


  try {
    const getOwenCost = await cost.aggregate([

      {
        $group: {
          _id: null,
          owenCost: { $sum: "$OtherCost" },
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
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}



exports.getCostReport = async (req, res) => {
  try {

    let { sdate, edate } = req.query
    sdate = (sdate) ? sdate : "2020-02-02"
    edate = (edate) ? edate : "3020-02-02"
    let start = new Date([sdate, "00:00:00"])
    let end = new Date([edate, "24:00:00"])

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
          totalFeesAndRepaidCostDubai: { $sum: { $sum: ["$feesAndRepaidCostDubairepairCost", "$feesAndRepaidCostDubaiFees", "$feesAndRepaidCostDubaiothers"] } },
          totalFeesRaqamAndRepairCostinKurdistan: { $sum: { $sum: ["$raqamAndRepairCostinKurdistanrepairCost", "$raqamAndRepairCostinKurdistanothers"] } }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])


    if (getCostSold.length < 1) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.status(200).json({
      QarzTotal: getCostSold
    })
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error" + e
    });
  }
}



// const cost = require('../models/costs')
// const qarz = require('../models/qars')
// const mongoose = require('mongoose')

// exports.getTotalGN = async (req, res) => {
//   try {
//     let sum = 0;
//     let bnft = 0;

//     const getAll = await cost.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalpricePaidbid: { $sum: "$pricePaidbid" },
//           totalCoCCost: { $sum: "$coCCost" },
//           totalTransportationCost: { $sum: { $sum: ["$transportationCostFromAmericaLocationtoDubaiGCostTranscost", "$transportationCostFromAmericaLocationtoDubaiGCostgumrgCost", "$dubaiToIraqGCostTranscost", "$dubaiToIraqGCostgumrgCost"] } },
//           totalFeesinAmerica: { $sum: { $sum: ["$feesinAmericaStoragefee", "$feesinAmericaCopartorIAAfee"] } },
//           totalFeesAndRepaidCostDubai: { $sum: { $sum: ["$feesAndRepaidCostDubairepairCost", "$feesAndRepaidCostDubaiFees", "$feesAndRepaidCostDubaiothers"] } },
//           totalFeesRaqamAndRepairCostinKurdistan: { $sum: { $sum: ["$raqamAndRepairCostinKurdistanrepairCost", "$raqamAndRepairCostinKurdistanRaqam", "$rsaqamAndRepairCostinKurdistanothers"] } },
//           carNumber: { "$sum": 1 }
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//         }
//       }
//     ])

//     const [getpriceSold] = await cost.aggregate([
//       { $match: { isSold: true } },
//       {
//         $group: {
//           _id: null,
//           totlPrice: { $sum: "$price" }
//         }
//       }
//     ])

//     const [getCostSold] = await cost.aggregate([
//       { $match: { isSold: true } },
//       {
//         $group: {
//           _id: null,
//           totalpricePaidbid: { $sum: "$pricePaidbid" },
//           totalCoCCost: { $sum: "$CoCCost" },
//           totalTransportationCost: { $sum: { $sum: ["$TDNEpUTHQoQUJMHLrErGJyHg89uy71MyuHiontoDubaiGCostTranscost", "$TDNEpUTHQoQUJMHLrErGJyHg89uy71MyuHiontoDubaiGCostgumrgCost", "$DubaiToIraqGCostTranscost", "$DubaiToIraqGCostgumrgCost"] } },
//           totalFeesinAmerica: { $sum: { $sum: ["$FeesinAmericaStoragefee", "$FeesinAmericaCopartorIAAfee"] } },
//           totalFeesAndRepaidCostDubai: { $sum: { $sum: ["$FeesAndRepaidCostDubairepairCost", "$FeesAndRepaidCostDubaiFees", "$FeesAndRepaidCostDubaiothers"] } },
//           totalFeesRaqamAndRepairCostinKurdistan: { $sum: { $sum: ["$RaqamAndRepairCostinKurdistanrepairCost", "$RaqamAndRepairCostinKurdistanRaqam", "$RaqamAndRepairCostinKurdistanothers"] } }
//         }
//       },
//       {
//         $project: {
//           _id: 0
//         }
//       }
//     ])

//     if (getAll.length < 1 && !getpriceSold) {
//       return res.status(404).json({
//         message: "Not Found",
//       });
//     }

//     if (getCostSold)
//       for (const props in getCostSold) {
//         sum += getCostSold[props]
//       }
//     if (getpriceSold)
//       bnft = getpriceSold.totlPrice - sum
//     if (getAll) {
//       getAll[0].totalbenefit = bnft;
//       getAll[0].totalpriceSold = getpriceSold?.totlPrice
//       getAll[0].totalCostSold = sum
//     }
//     res.status(200).json({
//       TotalList: getAll,
//     })
//   } catch (e) {
//     return res.status(500).json({
//       message: "Internal Server Error"
//     });
//   }
// }


// exports.getTotalOwe = async (req, res) => {
//   try {

//     const getQarz = await qarz.aggregate([

//       { $match: { isPaid: false } },
//       {
//         $lookup: {
//           from: "cars",
//           localField: "carId",
//           foreignField: "_id",
//           as: "car"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           qarzCarTotal: { $sum: { $sum: "$car.price" } },
//           qarzAmountTotal: { $sum: "$qarAmount" },
//           qarzTotal: {
//             $sum: {
//               $sum:
//                 [{ $sum: "$car.price" }, "$qarAmount"]
//             }
//           },

//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           qarzCarTotalByAmount: "$qarzCarTotal",
//           qarzAmountTotal: "$qarzAmountTotal",
//           qarzTotal: "$qarzTotal"
//         }
//       }

//     ])
//     if (getQarz.length < 1) {
//       return res.status(404).json({
//         message: "Not Found"
//       });
//     }
//     res.status(200).json({
//       QarzTotal: getQarz
//     })
//   } catch (e) {
//     return res.status(500).json({
//       message: "Internal Server Error"
//     });
//   }
// }


// exports.getTotalOwen = async (req, res) => {


//   try {
//     const getOwenCost = await cost.aggregate([

//       {
//         $group: {
//           _id: null,
//           owenCost: { $sum: "$OtherCost" },
//         }
//       },
//       {
//         $project: {
//           _id: 0,
//           owenCost: "$owenCost",
//         }
//       }
//     ])


//     if (getOwenCost.length < 1) {
//       return res.status(404).json({
//         message: "Not Found"
//       });
//     }
//     res.status(200).json({
//       QarzTotal: getOwenCost
//     })
//   } catch (e) {
//     return res.status(500).json({
//       message: "Internal Server Error"
//     });
//   }
// }
