module.exports = {
    "auth":{
        "signingKey": "ENV_AUTH_SIGNKEY",
        "maxSessionTime": "ENV_AUTH_MAXSESSIONTIME", //in hours.. this will invalidate your session key in defined hours
    }
};
