const car = require("../models/cars");
const mongoose = require("mongoose");
const cost = require("../models/costs");
const imgUpload = require("../helper/uploadFile")
const notSearch = require("../helper/Filter");
const qarz = require("../models/qars")

exports.getCarById = async (req, res) => {
  const id = req.params.Id;
  const projection = {
    price: 1,
    isSold: 1,
    pricePaidbid: 1,
    feesinAmericaStoragefee: 1,
    feesinAmericaCopartorIAAfee: 1,
    feesAndRepaidCostDubairepairCost: 1,
    feesAndRepaidCostDubaiFees: 1,
    feesAndRepaidCostDubaiothers: 1,
    feesAndRepaidCostDubainote: 1,
    coCCost: 1,
    transportationCostFromAmericaLocationtoDubaiGCostLocation: 1,
    transportationCostFromAmericaLocationtoDubaiGCostTranscost: 1,
    transportationCostFromAmericaLocationtoDubaiGCostgumrgCost: 1,
    dubaiToIraqGCostTranscost: 1,
    dubaiToIraqGCostgumrgCost: 1,
    raqamAndRepairCostinKurdistanrepairCost: 1,
    raqamAndRepairCostinKurdistanRaqam: 1,
    raqamAndRepairCostinKurdistanothers: 1,
    raqamAndRepairCostinKurdistannote: 1,
    userName: 1,
    email: 1,
    userRole: 1,
    TotalBals: 1
  }

  try {
    const getQarID = await qarz.find({ carId: id })

    var getDocs = await car
      .findById(id)
      .select({ __v: 0 })
      .populate("carCost userGiven", projection);

    if (getDocs == null) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(
      {
        carDetail: getDocs,
        userQarzId: getQarID[0]?.userId,
        isPaid: getQarID[0]?.isPaid
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


exports.getCarsSoled = async (req, res) => {
  const isSoled = req.params.bool
  let { search, page, limit } = req.query
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const regex = new RegExp(search, "i")
  const skip = notSearch(page)(limit)
  const searchDB = {
    $and: [
      { modeName: { $regex: regex } },
      { isSold: { $eq: isSoled } }
    ]
  }
  totalItems = await car.find(searchDB).countDocuments();

  try {

    const getDocs = await
      car
        .find(searchDB)
        .sort({ date: -1 })
        .limit(limit)
        .sort({ date: -1 })
        .skip(skip)
        .select({ __v: 0 })
        .populate("carCost userGiven", { token: 0, __v: 0 })

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(
      {
        carDetail: getDocs,
        total: totalItems
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"

    });
  }
};



exports.getCarsSoledLoan = async (req, res) => {
  const isSoled = req.params.bool
  const tobalance = req.params.string

  let { search, page, limit } = req.query
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const regex = new RegExp(search, "i")
  const skip = notSearch(page)(limit)
  const searchDB = {
    $and: [
      { modeName: { $regex: regex } },
      { isSold: { $eq: isSoled } },
      { tobalance: { $eq: tobalance } },
    ]
  }
  totalItems = await car.find(searchDB).countDocuments();

  try {

    const getDocs = await
      car
        .find(searchDB)
        .sort({ date: -1 })
        .limit(limit)
        .skip(skip)
        .select({ __v: 0 })
        .populate("carCost userGiven", { token: 0, __v: 0 })

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(
      {
        carDetail: getDocs,
        total: totalItems
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"

    });
  }
};




exports.getCarsArr = async (req, res) => {
  const isArr = req.params.bool
  let { search, page, limit } = req.query
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  const regex = new RegExp(search, "i")
  const skip = notSearch(page)(limit)
  const searchDB = {
    $and: [
      { modeName: { $regex: regex } },
      { arrived: { $eq: isArr } }
    ]
  }

  totalItems = await car.find(searchDB).countDocuments();

  try {
    const getDocs = await
      car
        .find(searchDB)
        .sort({ date: -1 })
        .limit(limit)
        .sort({ date: -1 })
        .skip(skip)
        .select({ __v: 0 })
        .populate("carCost userGiven", { token: 0, __v: 0 })

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(
      {
        carDetail: getDocs,
        total: totalItems
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error"

    });
  }
};

exports.getCars = async (req, res) => {

<<<<<<< HEAD
  let { search, page, limit, sdate, edate, arrDu, arrKu, isSold } = req.query
=======
  let { search, page, limit, sdate, edate, arrDu, arrKu, isSold,tobalance,visibility} = req.query
>>>>>>> ff0c54d (17/12)
  sdate = (sdate) ? sdate : "2020-02-02"
  edate = (edate) ? edate : "3020-02-02"
  let start = new Date([sdate, "00:00:00"])
  let end = new Date([edate, "24:00:00"])

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;
  console.log(arrDu)
  console.log(arrKu)
  console.log(isSold)

  arrDu = parseInt(arrDu, 10)
  arrKu = parseInt(arrKu, 10)
  isSold = parseInt(isSold, 10)


  const optionalQuery = {
     '0':{},
     '1':{},
     '2':{},
<<<<<<< HEAD
=======
     '3':{},
     '4':{},

>>>>>>> ff0c54d (17/12)
  }

  arrDu = (!Number.isNaN(arrDu)) ? optionalQuery[0] = {
    arrivedToDoubai: { $eq: arrDu }
  } : arrDu;

  arrKu = (!Number.isNaN(arrKu)) ? optionalQuery[1] = {
    arrivedToKurd: { $eq: arrKu }
  } : arrKu;
  isSold = (!Number.isNaN(isSold)) ? optionalQuery[2] = {
    isSold: { $eq: isSold }
  } : isSold;

<<<<<<< HEAD

  console.log(optionalQuery[0])
=======
  tobalance = (tobalance=="Cash"||tobalance=="Rent") ? optionalQuery[3] = {
    tobalance: { $eq: tobalance }
  } : tobalance;

  visibility = (visibility=="Public"||visibility=="Private") ? optionalQuery[4] = {
    tire: { $eq: visibility }
  } : visibility;

>>>>>>> ff0c54d (17/12)

  const regex = new RegExp(search, "i")
  const skip = notSearch(page)(limit)
  const searchDB = {
    $and: [
      { modeName: { $regex: regex } },
      optionalQuery[0],
      optionalQuery[1],
      optionalQuery[2],
<<<<<<< HEAD
=======
      optionalQuery[3],
      optionalQuery[4],


>>>>>>> ff0c54d (17/12)
      {
        date: {
          $gte: start,
          $lte: end
        }
      },
    ]
  }

  console.log(JSON.stringify(searchDB))
  console.log(searchDB)
  try {
    totalItems = await car.find(searchDB).countDocuments();
    const getDocs = await
      car
        .find(searchDB)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .select({ __v: 0 })
        .populate("carCost")

    if (getDocs.length < 1) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json(
      {
        carDetail: getDocs,
        total: totalItems
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error" + e

    });
  }
};

exports.createCar = async (req, res) => {

  imgUpload(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        message: "Bad Request",
        error: err
      });
    }


    console.log(req.body)
<<<<<<< HEAD
    var pictureandvideodamage, pictureandvideorepair, CarDamage
=======
    var pictureandvideodamage, pictureandvideorepair, CarDamage,FirstImage
>>>>>>> ff0c54d (17/12)
    const pricebid = req.body.PricePaidbid;
    const Storagefee = req.body.FeesinAmericaStoragefee;
    const CopartorIAAfee = req.body.FeesinAmericaCopartorIAAfee;
    const repairCostDubai = req.body.FeesAndRepaidCostDubairepairCost;
    const FeesDubai = req.body.FeesAndRepaidCostDubaiFees;
    const othersDubai = req.body.FeesAndRepaidCostDubaiothers;
    const noteDubai = req.body.FeesAndRepaidCostDubainote;
    const CoCCost = req.body.CoCCost;
    const LocationDubaiG =
      req.body.TransportationCostFromAmericaLocationtoDubaiGCostLocation;
    const TranscostDubaiG =
      req.body.TransportationCostFromAmericaLocationtoDubaiGCostTranscost;
    const gumrgCostDubaiG =
      req.body.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost;
    const TranscostIraqG =
      req.body.DubaiToIraqGCostTranscost;
    const gumrgCostIraqG =
      req.body.DubaiToIraqGCostgumrgCost;
    const repairCostKurdistan =
      req.body.RaqamAndRepairCostinKurdistanrepairCost;
    const RaqamKurdistan = req.body.RaqamAndRepairCostinKurdistanRaqam;
    const othersKurdistan = req.body.RaqamAndRepairCostinKurdistanothers;
    const noteKurdistan = req.body.RaqamAndRepairCostinKurdistannote;
    const sold = req.body.Price;
    const isSold = req.body.IsSold;
    const modeName = req.body.ModeName;
    const model = req.body.Model;
    const color = req.body.Color;
    const mileage = req.body.Mileage;
    const VINNumber = req.body.VINNumber;
    const wheelDriveType = req.body.WheelDriveType;
    const userGiven = req.body.UserGiven;
    const sellerCar = req.body.SellerCar;

    const carOver = req.body.CarOver;

    if (req.files?.Pictureandvideodamage)
      pictureandvideodamage = (req.files.Pictureandvideodamage).map(({ filename, mimetype }) => ({ filename, mimetype }))
    if (req.files?.Pictureandvideorepair)
      pictureandvideorepair = (req.files.Pictureandvideorepair).map(({ filename, mimetype }) => ({ filename, mimetype }));
    if (req.files?.CarDamage)
      CarDamage = (req.files.CarDamage).map(({ filename, mimetype }) => ({ filename, mimetype }));

      if (req.files?.FirstImage)
        FirstImage = (req.files.FirstImage).map(({ filename, mimetype }) => ({ filename, mimetype }));

    const addCar = new car({
      _id: mongoose.Types.ObjectId(),
      price: sold,
      isSold: isSold,
      modeName: modeName,
      model: model,
      color: color,
      mileage: mileage,
      VINNumber: VINNumber,
      wheelDriveType: wheelDriveType,
      userGiven: userGiven,
      pictureandvideodamage: pictureandvideodamage,
      pictureandvideorepair: pictureandvideorepair,
      tocar: req.body.Tocar,
      tobalance: req.body.Tobalance,
      tire: req.body.Tire,
      date: req.body.date,
      arrivedToKurd: req.body.ArrivedToKurd,
      arrivedToDoubai: req.body.ArrivedToDoubai,
      carOver: carOver,
      sellerCar: sellerCar,
      carDamage: CarDamage,
      FirstImage:FirstImage,
    });

    const carCost = new cost({
      _id: mongoose.Types.ObjectId(),
      price: sold,
      isSold: isSold,
      pricePaidbid: pricebid,
      feesinAmericaStoragefee: Storagefee,
      feesinAmericaCopartorIAAfee: CopartorIAAfee,
      feesAndRepaidCostDubairepairCost: repairCostDubai,
      feesAndRepaidCostDubaiFees: FeesDubai,
      feesAndRepaidCostDubaiothers: othersDubai,
      feesAndRepaidCostDubainote: noteDubai,
      coCCost: CoCCost,
      transportationCostFromAmericaLocationtoDubaiGCostLocation: LocationDubaiG,
      transportationCostFromAmericaLocationtoDubaiGCostTranscost: TranscostDubaiG,
      transportationCostFromAmericaLocationtoDubaiGCostgumrgCost: gumrgCostDubaiG,
      dubaiToIraqGCostTranscost: TranscostIraqG,
      dubaiToIraqGCostgumrgCost: gumrgCostIraqG,
      raqamAndRepairCostinKurdistanrepairCost: repairCostKurdistan,
      raqamAndRepairCostinKurdistanRaqam: RaqamKurdistan,
      raqamAndRepairCostinKurdistanothers: othersKurdistan,
      raqamAndRepairCostinKurdistannote: noteKurdistan,
    });

    carCost
      .save()
      .then((out) => {
        addCar.carCost = out._id;
        addCar
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
      })
      .catch((e) => {
        return res.status(500).json({
          message: "Internal Server Error"
        });
      });
  })
};



exports.updateCar = (req, res) => {


  imgUpload(req, res, async function (err) {
    if (err) {
      return res.send(err)
    }
    try {
      const id = req.params.Id;
      const pricebid = req.body.PricePaidbid
      const Storagefee = req.body.FeesinAmericaStoragefee
      const CopartorIAAfee = req.body.FeesinAmericaCopartorIAAfee
      const repairCostDubai = req.body.FeesAndRepaidCostDubairepairCost
      const FeesDubai = req.body.FeesAndRepaidCostDubaiFees
      const othersDubai = req.body.FeesAndRepaidCostDubaiothers
      const noteDubai = req.body.FeesAndRepaidCostDubainote
      const CoCCost = req.body.CoCCost
      const LocationDubaiG =
        req.body.TransportationCostFromAmericaLocationtoDubaiGCostLocation
      const TranscostDubaiG =
        req.body.TransportationCostFromAmericaLocationtoDubaiGCostTranscost
      const gumrgCostDubaiG =
        req.body.TransportationCostFromAmericaLocationtoDubaiGCostgumrgCost
      const TranscostIraqG =
        req.body.DubaiToIraqGCostTranscost
      const gumrgCostIraqG =
        req.body.DubaiToIraqGCostgumrgCost
      const repairCostKurdistan =
        req.body.RaqamAndRepairCostinKurdistanrepairCost
      const RaqamKurdistan = req.body.RaqamAndRepairCostinKurdistanRaqam
      const othersKurdistan = req.body.RaqamAndRepairCostinKurdistanothers
      const noteKurdistan = req.body.RaqamAndRepairCostinKurdistannote
      const sold = req.body.Price;
      const isSold = req.body.IsSold;

      const updateopcost = {
        price: sold,
        isSold: isSold,
        pricePaidbid: pricebid,
        feesinAmericaStoragefee: Storagefee,
        feesinAmericaCopartorIAAfee: CopartorIAAfee,
        feesAndRepaidCostDubairepairCost: repairCostDubai,
        feesAndRepaidCostDubaiFees: FeesDubai,
        feesAndRepaidCostDubaiothers: othersDubai,
        feesAndRepaidCostDubainote: noteDubai,
        coCCost: CoCCost,
        transportationCostFromAmericaLocationtoDubaiGCostLocation: LocationDubaiG,
        transportationCostFromAmericaLocationtoDubaiGCostTranscost: TranscostDubaiG,
        transportationCostFromAmericaLocationtoDubaiGCostgumrgCost: gumrgCostDubaiG,
        dubaiToIraqGCostTranscost: TranscostIraqG,
        dubaiToIraqGCostgumrgCost: gumrgCostIraqG,
        raqamAndRepairCostinKurdistanrepairCost: repairCostKurdistan,
        raqamAndRepairCostinKurdistanRaqam: RaqamKurdistan,
        raqamAndRepairCostinKurdistanothers: othersKurdistan,
        raqamAndRepairCostinKurdistannote: noteKurdistan,
      };

      var pictureandvideodamage, pictureandvideorepair, CarDamage

      if (req.files?.Pictureandvideodamage)
        pictureandvideodamage = (req.files.Pictureandvideodamage).map(({ filename, mimetype }) => ({ filename, mimetype }))
      if (req.files?.Pictureandvideorepair)
        pictureandvideorepair = (req.files.Pictureandvideorepair).map(({ filename, mimetype }) => ({ filename, mimetype }));
      if (req.files?.CarDamage)
        CarDamage = (req.files.CarDamage).map(({ filename, mimetype }) => ({ filename, mimetype }));

      const modeName = req.body.ModeName;
      const model = req.body.Model;
      const color = req.body.Color;
      const mileage = req.body.Mileage;
      const VINNumber = req.body.VINNumber;
      const wheelDriveType = req.body.WheelDriveType;
      const userGiven = req.body.UserGiven;
      const sellerCar = req.body.SellerCar;
      const carOver = req.body.CarOver;


      const updateops = {
        price: sold,
        isSold: isSold,
        modeName: modeName,
        model: model,
        color: color,
        mileage: mileage,
        VINNumber: VINNumber,
        wheelDriveType: wheelDriveType,
        userGiven: userGiven,
        sellerCar: sellerCar,
        tocar: req.body.Tocar,
        tobalance: req.body.Tobalance,
        tire: req.body.Tire,
        date: req.body.Date,
        arrivedToKurd: req.body.ArrivedToKurd,
        arrivedToDoubai: req.body.ArrivedToDoubai,
        pictureandvideodamage: pictureandvideodamage,
        pictureandvideorepair: pictureandvideorepair,
        carOver: carOver,
        carDamage: CarDamage,
      };

      updateCar = await car.findOneAndUpdate(
        { _id: id },
        { $set: updateops },
        { new: true }
      );
      if (!updateCar)
        return res.status(404).json({
          message: "Not Found",
        });
      if (updateopcost) {
        let idCon = updateCar.carCost.valueOf();

        updateCost = await cost.findOneAndUpdate(
          { _id: idCon },
          { $set: updateopcost },
          { new: true }
        );
        updateCar.carCost = updateCost
      }

      res.status(200).json({
        carDetail: updateCar
      });

    } catch (e) {
      res.status(500).json({
        message: "Invaild operation",
      });
    }
  })
};

exports.deleteCar = async (req, res) => {
  const id = req.params.Id;

  const findQarz = await qarz.findOne({ carId: req.params.Id });

  if (findQarz)
    return res.status(409).json({
      message: "Confilct, the car is under loan, could n\'t be deleted",
      qarzDetail: findQarz
    });

  car.findOneAndDelete({ _id: id }, async (err, docs) => {
    if (err) {
      return res.status(400).json({
        message: "bad Request",
      });
    } else if (docs) {
      if (docs.carCost !== undefined) {
        let idCon = docs.carCost.valueOf();
        var d = await cost.deleteOne({ _id: idCon });

      }
      res.status(204).json({});
    } else {
      return res.status(500).json({
        message: "Invaild operation"
      });
    }
  });
};
