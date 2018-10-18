const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const config = require('config');
const moment = require('moment');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

global.appStartTime = moment();

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

app.get('/', function (req, res) {
    res.send({
        version: "1.0.0",
        name: "My App",
        since: moment(global.appStartTime).fromNow()
    });
})

app.listen(8000, () => {
    console.log("App starting...")
});




