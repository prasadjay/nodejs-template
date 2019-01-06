const app = require('./services/express');
const config = require('config');
const moment = require('moment');
const logger = require('./services/logger');
const path = require('path');
global.appStartTime = moment();
global.fetch = require('node-fetch');

// Swagger
const swaggerTools = require('swagger-tools');
const YAML = require('yamljs');
const swaggerDoc = YAML.load(path.join(__dirname, 'swagger.yaml'));
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
});

//initiate mongo connection
const MongooseConnection = new require('./services/mongoose');
let connection = new MongooseConnection();

// const UserModel = require('./worker/UserWorker');
//
// UserModel.Create({platform: "facebook", username:"asdf", password: "123"}).then((result)=>{
//     console.log(result);
// }).catch((exception)=>{
//     console.log(exception.message);
// })

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

/**
 * Service method
 */
app.get('/', function (req, res) {
    res.send({
        version: "1.0.0",
        name: "Tywar API",
        since: moment(global.appStartTime).fromNow()
    });
})

app.listen(config.app.port, () => {
    logger.info(`server started on port ${config.app.port} (${config.app.env})`);
});




