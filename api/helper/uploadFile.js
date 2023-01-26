const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/'

    if (!fs.existsSync(dir))
      fs.mkdirSync(dir)

    cb(null, dir);
  },
  filename: function (req, file, cb) {


    if (file.mimetype === 'image/jpeg')
      fname = (new Date().toISOString() + '.jpeg').replace(/:/g, '-');
    else if (file.mimetype === 'image/png')
      fname = (new Date().toISOString() + '.png').replace(/:/g, '-');
    else if (file.mimetype === 'video/x-matroska')
      fname = (new Date().toISOString() + '.x-matroska').replace(/:/g, '-');
    else
      fname = (new Date().toISOString() + '.mp4').replace(/:/g, '-');

    cb(null, fname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4' || file.mimetype === 'video/x-matroska') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10240000000 * 590000000,
    fieldSize: 102000000000
  },
  fileFilter: fileFilter
})
  .fields([{
    name: 'Pictureandvideodamage',
    maxCount: 15
  }, {
    name: 'Pictureandvideorepair',
    maxCount: 15
  },
  {
    name: 'CarDamage',
    maxCount: 1
  },
  {
    name: 'FirstImage',
    maxCount: 1
  }
  ]);

module.exports = upload
