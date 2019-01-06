var util = require('util');
var mongoose = require('mongoose');
var config = require('config');
const logger = require('./logger');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
module.exports = class MongooseConnection {

    constructor() {
        this.mongoip=config.Mongo.ip;
        this.mongoport=config.Mongo.port;
        this.mongodb=config.Mongo.dbname;
        this.mongouser=config.Mongo.user;
        this.mongopass = config.Mongo.password;
        this.mongoreplicaset= config.Mongo.replicaset;
        this.cloudatlas= false;

        if(config.Mongo.cloudAtlas){
            this.cloudatlas = config.Mongo.cloudAtlas;
        }

        let connectionstring = '';
        let _mongoip = this.mongoip.split(',');
        if(Array.isArray(_mongoip)){

            if(this.cloudatlas === true ||this.cloudatlas === 'true' ){
                connectionstring = util.format('mongodb+srv://%s:%s@%s/%s?retryWrites=true',this.mongouser,this.mongopass,this.mongoip,this.mongodb)
                //connectionstring = "mongodb+srv://jay:P3R2A0d123456@cluster0-wnycu.mongodb.net/test?retryWrites=true";
            }
            else if(_mongoip.length > 1){

                _mongoip.forEach(function(item){
                    connectionstring += util.format('%s:%d,',item,this.mongoport)
                });

                connectionstring = connectionstring.substring(0, connectionstring.length - 1);
                connectionstring = util.format('mongodb://%s:%s@%s/%s',this.mongouser,this.mongopass,connectionstring,this.mongodb);

                if(this.mongoreplicaset){
                    connectionstring = util.format('%s?replicaSet=%s',connectionstring,this.mongoreplicaset) ;
                }


            }
            else{

                //connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',this.mongouser,this.mongopass,_mongoip[0],this.mongoport,this.mongodb)
                connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',this.mongouser,this.mongopass,this.mongoip,this.mongoport,this.mongodb)
            }

        }else{

            connectionstring = util.format('mongodb://%s:%s@%s:%d/%s',this.mongouser,this.mongopass,this.mongoip,this.mongoport,this.mongodb)
        }
        mongoose.connect(connectionstring,{useNewUrlParser: true,autoReconnect :true});

    }

}



mongoose.connection.on('error', function (err) {
    console.error( new Error(err));
    logger.error(`Error connecting to DB : ${err.message}`);
    mongoose.disconnect();

});

mongoose.connection.on('opening', function() {
    logger.error(`Connection broken. Reconnecting...`);
    console.log("reconnecting... %d", mongoose.connection.readyState);
});


mongoose.connection.on('disconnected', function() {
    console.error( new Error('Could not connect to database'));
    logger.error(`Disconnected from Database!`);
    //mongoose.connect(connectionstring,{server:{auto_reconnect:true}});
});

mongoose.connection.once('open', function() {
    logger.info("Connected to db");
    console.log("Connected to db");

});


mongoose.connection.on('reconnected', function () {
    logger.info('MongoDB reconnected!');
    console.log('MongoDB reconnected!');
});


process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        logger.error('Mongoose default connection disconnected through app termination');
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});






