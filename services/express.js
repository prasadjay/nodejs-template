const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const v1_routes = require('../routes/v1');
const config = require('config');
const cognito = require('./cognito');
/**
* Express instance
* @public
*/
const app = express();
// request logging. dev: console | production: file
app.use(morgan(config.app.http_log_env));
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

//Add authentication to middleware
app.use(function (req, res, next) {
    cognito.ValidateToken(req).then((result) => {
        //res.send(result);
        next()
    }).catch((exception) => {
        res.status(500);
        res.send(exception);
    });
})

// mount api v1 routes
app.use('/v1', v1_routes);

module.exports = app;
