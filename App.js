const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const favicon = require('./api/middleware/fav')
require('dotenv').config()
const carRoutes = require('./api/routes/cars');
const qarsB = require('./api/routes/qarsB');
const userRoutes = require('./api/routes/users');
const userCarRoutes = require('./api/routes/reseller');
const overviewRoutes = require('./api/routes/overview');
const qarRoutes = require('./api/routes/qars');
const balRoutes = require('./api/routes/balance')
const costRoutes = require('./api/routes/costs')
const deleteIMG = require('./api/routes/deleteIMG');
const cookieParser = require('cookie-parser')
const authn = require('./api/middleware/check-auth')
const ex = require('./api/routes/Exchange')
const authr = require('./api/middleware/checkAuthr')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp')
const validation = require('./api/validation/validate')

corsOptions = {
  // origin: ['http://84.46.255.116/', 'http://84.46.255.116/_API'],
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  // origin: ['https://alwandcars.com/', 'https://alwandcars.com/_API'],

  credentials: true,
  allowedHeaders: ['Strict-Transport-Security', 'ETag', 'Last-Modified', 'Cache-Control', 'Access-Control-Allow-Headers', 'Origin', 'Accept', 'Accept-Encoding', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'authorization']
}


app.use(cors(corsOptions))
app.use(xss())
app.use(mongoSanitize());
app.use(hpp())
app.use(helmet.contentSecurityPolicy({
  directives: {
    "font-src": [
      "self",
      "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap",
      "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap"
    ]
  }
})
);
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

app.use(helmet.hidePoweredBy());

//mongodb+srv://rmb22344321:rawa12345@cluster0.mkjxmml.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://Hawbir:!qazxsw2@cluster0.rc962aj.mongodb.net/?retryWrites=true&w=majority
// mongodb://127.0.0.1:27017/
mongoose.connect('mongodb://127.0.0.1:27017/', e => {
  if (e)
    Error('The ERORRE is ' + e)
  else

    console.log('The DB is connected ')
})

app.use(bodyParser.json({
  limit: '100000000Kb'
}))
app.use(cookieParser())

app.use(morgan("dev"));
app.use('/_API/uploads', express.static('uploads'));

// Routes
app.use(express.static(__dirname + '/view'))
app.use("/_API/users", userRoutes);
app.use("/_API/cars", carRoutes);
app.use("/_API/reseller", userCarRoutes);
app.use("/_API/cost", overviewRoutes);
app.use("/_API/qarz", qarRoutes);
app.use("/_API/bal", balRoutes);
app.use("/_API/ownCost", costRoutes);
app.use("/_API/deleteFile", deleteIMG);
app.use("/_API/qarzB", qarsB);
app.use("/_API/ExCh", ex);


// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found Page");
  error.name = 'App error'
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      url: req.url

    }
  });
});
module.exports = app;
