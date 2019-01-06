module.exports = {
    "app": {
        "port": 3333,
        "http_log_env": "dev", //dev, combined, short,
        "env": "dev" //dev, live
    },
    "auth": {
        "signingKey": "iu2gtr2439ytgohifugvh34ufv3utf",
        "maxSessionTime": 750, //in hours.. this will invalidate your session key in defined hours
    },
    "Mongo": {
        "ip": "28.163.245.54",
        "port": "27017",
        "dbname": "admin",
        "user": "root",
        "password": "123",
        "replicaset": "",
        "cloudAtlas": false
    },
    "Cognito": {
        "UserPoolId": "ap-south-1_541ziTvG",
        "ClientId": "5vljutntddfah859fmbop6qvtk",
        "PoolRegion": "ap-south-1"
    },
    "Redis":{
        "mode":"instance",//instance, cluster, sentinel
        "ip": "25.25.25.25",
        "port": 6379,
        "user": "admin",
        "password": "pass",
        "db": 0,
        "sentinels":{}
    }
};