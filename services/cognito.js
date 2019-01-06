const common = require('../common/common');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const config = require('config');
const Promise = require("bluebird");
//const Redis = require('./redis');
//var redis = new Redis();

const poolData = {
    UserPoolId: config.Cognito.UserPoolId,
    ClientId: config.Cognito.ClientId
};

const pool_region = config.Cognito.PoolRegion;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports.ValidateToken = (req) => {
    return new Promise(function (resolve, reject) {
        let exclude_routes = [
            "/",
            "/docs",
            "/auth/login",
            "/auth/register",
            "/auth/register"
        ]

        var jsonString;
        if (common.in_array(exclude_routes, req.url)) {
            jsonString = common.Error("Ignoring token...", undefined);
            resolve(jsonString);
        } else {
            if (req.headers.hasOwnProperty("authorization")) {
                let token = req.headers.authorization.replace('Bearer ', '');

                token = token.replace('bearer ', '');
                request({
                    url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
                    json: true
                }, function (error, common, body) {
                    if (!error && common.statusCode === 200) {
                        pems = {};
                        var keys = body['keys'];
                        for (var i = 0; i < keys.length; i++) {
                            //Convert each key to PEM
                            var key_id = keys[i].kid;
                            var modulus = keys[i].n;
                            var exponent = keys[i].e;
                            var key_type = keys[i].kty;
                            var jwk = {kty: key_type, n: modulus, e: exponent};
                            var pem = jwkToPem(jwk);
                            pems[key_id] = pem;
                        }
                        //validate the token
                        var decodedJwt = jwt.decode(token, {complete: true});
                        if (!decodedJwt) {
                            jsonString = common.Error("Invalid token. JWT decoding failed..", undefined);
                            reject(jsonString);
                        }

                        var kid = decodedJwt.header.kid;
                        var pem = pems[kid];
                        if (!pem) {
                            jsonString = common.Error("Invalid token. JWT had invalid kid value.", undefined);
                            reject(jsonString);
                        }

                        jwt.verify(token, pem, function (err, payload) {
                            if (err) {
                                jsonString = common.Error("Invalid token.", err);
                                reject(jsonString);
                            } else {
                                jsonString = common.Success("Valid token.", payload);
                                resolve(jsonString);
                            }
                        });
                    } else {
                        jsonString = common.Error("Unable to fetch metadata from tokenserver.", undefined);
                        reject(jsonString);
                    }
                });
            } else {
                reject(common.Error("No token found. Please supply JWT token in Authorization header. ex: Authorization : Bearer <JWT>", undefined));
            }
        }
    });
};

module.exports.RegisterByEmail = (json) => {
    return new Promise(function (resolve, reject) {
        var jsonString;
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "name", Value: json.name}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: json.email}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "picture", Value: json.pictureUrl}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "gender", Value: json.gender}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "birthdate", Value: json.bday}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "address", Value: json.address}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "locale", Value: json.locale}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "phone_number", Value: json.phone}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_1", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_2", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_3", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:origin", Value: "email"}));

        let userPayload = {
            name: json.name,
            email: json.email,
            picture: json.pictureUrl,
            gender: json.gender,
            birthdate: json.bday,
            address: json.address,
            locale: json.locale,
            phone_number: json.phone,
            attribute_1: "n/a",
            attribute_2: "n/a",
            attribute_3: "n/a",
            origin: "email"
        }

        let regUsername = json.email;

        if (regUsername == "") {
            jsonString = Response.Error("Email not found. Cannot create an account.", undefined);
            reject(jsonString);
        } else {
            userPool.signUp(regUsername, json.password, attributeList, null, (err, result) => {
                if (err) {
                    if (err.message) {
                        jsonString = Response.Error(err.message, err);
                    } else {
                        jsonString = Response.Error("Failed to create an user account", err);
                    }
                    reject(jsonString);
                } else {
                    ClientUserService.Create(userPayload);
                    jsonString = Response.Success("Successfully created an user account.", result.user);
                    resolve(jsonString);
                }
            });
        }
    });
};

module.exports.RegisterByMobile = (json) => {
    return new Promise(function (resolve, reject) {
        var jsonString;
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "name", Value: json.name}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: json.email}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "picture", Value: json.pictureUrl}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "gender", Value: json.gender}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "birthdate", Value: json.bday}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "address", Value: json.address}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "locale", Value: json.locale}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "phone_number", Value: json.phone}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_1", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_2", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:attribute_3", Value: "n/a"}));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "custom:origin", Value: "mobile"}));

        let userPayload = {
            name: json.name,
            email: json.email,
            picture: json.pictureUrl,
            gender: json.gender,
            birthdate: json.bday,
            address: json.address,
            locale: json.locale,
            phone_number: json.phone,
            attribute_1: "n/a",
            attribute_2: "n/a",
            attribute_3: "n/a",
            origin: "mobile"
        }

        let regUsername = json.phone;

        if (regUsername == "") {
            jsonString = Response.Error("Phone not found. Cannot create an account.", undefined);
            reject(jsonString);
        } else {
            userPool.signUp(regUsername, json.password, attributeList, null, (err, result) => {
                if (err) {
                    jsonString = Response.Error("Failed to create an user account", err);
                    reject(jsonString);
                } else {
                    ClientUserService.Create(userPayload);

                    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
                        region: pool_region, credentials: {
                            "accessKeyId": config.Cognito.IAM_Access_Key,
                            "secretAccessKey": config.Cognito.IAM_Secret_Key
                        }
                    });

                    var params = {
                        UserPoolId: poolData.UserPoolId, /* required */
                        Username: regUsername /* required */
                    };
                    cognitoidentityserviceprovider.adminConfirmSignUp(params, function (err, data) {
                        if (err) {
                            if (err.message) {
                                jsonString = Response.Error(err.message, err);
                            } else {
                                jsonString = Response.Error("Failed to verify an user account", err);
                            }
                            reject(jsonString);
                        } else {
                            var sns = new AWS.SNS({
                                region: 'us-east-1', credentials: {
                                    "accessKeyId": config.Cognito.IAM_Access_Key,
                                    "secretAccessKey": config.Cognito.IAM_Secret_Key
                                },
                                apiVersion: '2010-03-31'
                            });
                            var params = {
                                Message: `Welcome to Watchit.lk! Your account is ready for use now. Enjoy!`,
                                MessageStructure: 'text',
                                PhoneNumber: regUsername
                            };

                            sns.publish(params, function (err, data) {
                                if (err) {
                                    if (err.message) {
                                        console.log(err.message);
                                    } else {
                                        console.log("Error sending account creation success.");
                                    }
                                } else {
                                    console.log("Sent account creation success.")
                                }
                            });

                            jsonString = Response.Success("Successfully created user account.", undefined);
                            reject(jsonString);
                        }
                    });
                }
            });
        }
    });
};

module.exports.SendOTP = (number) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var sns = new AWS.SNS({
            region: 'us-east-1', credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            },
            apiVersion: '2010-03-31'
        });

        let code = Math.floor(1000 + Math.random() * 9000).toString();
        let key = `OTP:${number}`

        redis.SetRaw(key, 86400, code).then((value) => {
            var params = {
                Message: `Welcome to Watchit.lk! Your OTP code is ${code}`,
                MessageStructure: 'text',
                PhoneNumber: number
            };
            sns.publish(params, function (err, data) {
                if (err) {
                    jsonString = Response.Error("Failed to send OTP code.", err);
                    reject(jsonString);
                } else {
                    jsonString = Response.Success("Successfully sent OTP code.", undefined);
                    resolve(jsonString);
                }
            });
        }).catch((err) => {
            jsonString = Response.Error("Error sending OTP code", undefined);
            reject(jsonString);
        });
    });
};

module.exports.RegisterByFacebook = (access_token) => {
    return new Promise(function (resolve, reject) {
        var jsonString;
        let username = "";
        let name = "";
        let pictureUrl = "";
        let password = "";

        request({
            url: `https://graph.facebook.com/v3.0/me?access_token=${access_token}&fields=id,email,name`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200 && body.email && body.email != "") {
                username = body.email;
                name = body.name;
                password = `Watch#It${body.id}`
                request({
                    url: `https://graph.facebook.com/v3.0/me/picture?access_token=${access_token}&height=1024&width=1024&redirect=0`,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200 && body.data.url && body.data.url != "") {
                        pictureUrl = body.data.url;
                    } else {
                        pictureUrl = "https://s3.ap-south-1.amazonaws.com/watchitlk-content-assets/Misc/SampleUser.png";
                    }

                    //create the actual user....
                    var attributeList = [];
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "name", Value: name}));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "email",
                        Value: username
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "picture",
                        Value: pictureUrl
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "gender",
                        Value: "Not Available"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "birthdate",
                        Value: "1970-01-01"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "address",
                        Value: "Not Available"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "locale",
                        Value: "Not Available"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "phone_number",
                        Value: "+94000000000"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "custom:attribute_1",
                        Value: "n/a"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "custom:attribute_2",
                        Value: "n/a"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "custom:attribute_3",
                        Value: "n/a"
                    }));
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
                        Name: "custom:origin",
                        Value: "facebook"
                    }));

                    let userPayload = {
                        name: name,
                        email: username,
                        picture: pictureUrl,
                        gender: "Not Available",
                        birthdate: "1970-01-01",
                        address: "Not Available",
                        locale: "Not Available",
                        attribute_1: "n/a",
                        attribute_2: "n/a",
                        attribute_3: "n/a",
                        origin: "facebook"
                    }

                    userPool.signUp(username, password, attributeList, null, (err, result) => {
                        if (err) {
                            if (err.code == "UsernameExistsException") {
                                var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                                    Username: username,
                                    Password: password,
                                });

                                var userData = {
                                    Username: username,
                                    Pool: userPool
                                };
                                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                                cognitoUser.authenticateUser(authenticationDetails, {
                                    onSuccess: function (result) {
                                        let responseObject = {
                                            access_token: result.getAccessToken().getJwtToken(),
                                            id_token: result.getIdToken().getJwtToken(),
                                            refresh_token: result.getRefreshToken().getToken()
                                        }
                                        jsonString = Response.Success("Login successful.", responseObject);
                                        resolve(jsonString);
                                    },
                                    onFailure: function (err) {
                                        if (err.message) {
                                            jsonString = Response.Success(err.message, err);
                                        } else {
                                            jsonString = Response.Success("Login failed.", err);
                                        }
                                        reject(jsonString);
                                    },
                                });
                            } else {
                                if (err.message) {
                                    jsonString = Response.Error(err.message, err);
                                } else {
                                    jsonString = Response.Error("Error creating the user.", err);
                                }
                                reject(jsonString);
                            }
                        } else {
                            ClientUserService.Create(userPayload);

                            var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
                                region: pool_region, credentials: {
                                    "accessKeyId": config.Cognito.IAM_Access_Key,
                                    "secretAccessKey": config.Cognito.IAM_Secret_Key
                                }
                            });

                            var params = {
                                UserPoolId: poolData.UserPoolId, /* required */
                                Username: username /* required */
                            };
                            cognitoidentityserviceprovider.adminConfirmSignUp(params, function (err, data) {
                                if (err) {
                                    if (err.message) {
                                        jsonString = Response.Error(err.message, err);
                                    } else {
                                        jsonString = Response.Error("Failed to verify an user account", err);
                                    }
                                    reject(jsonString);
                                } else {
                                    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
                                        Username: username,
                                        Password: password,
                                    });

                                    var userData = {
                                        Username: username,
                                        Pool: userPool
                                    };
                                    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                                    cognitoUser.authenticateUser(authenticationDetails, {
                                        onSuccess: function (result) {
                                            let responseObject = {
                                                access_token: result.getAccessToken().getJwtToken(),
                                                id_token: result.getIdToken().getJwtToken(),
                                                refresh_token: result.getRefreshToken().getToken()
                                            }
                                            jsonString = Response.Success("Login successful.", responseObject);
                                            resolve(jsonString);
                                        },
                                        onFailure: function (err) {
                                            if (err.message) {
                                                jsonString = Response.Success(err.message, err);
                                            } else {
                                                jsonString = Response.Success("Login failed.", err);
                                            }
                                            reject(jsonString);
                                        },
                                    });
                                }
                            });
                        }
                    });
                });
            } else {
                jsonString = Response.Error("Unknown error occured!", undefined);
                reject(jsonString);
            }
        });
    });
};

module.exports.Login = (username, password) => {
    return new Promise(function (resolve, reject) {
        var jsonString;
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                let responseObject = {
                    access_token: result.getAccessToken().getJwtToken(),
                    id_token: result.getIdToken().getJwtToken(),
                    refresh_token: result.getRefreshToken().getToken()
                }
                jsonString = Response.Success("Login successful.", responseObject);
                resolve(jsonString);
            },
            onFailure: function (err) {
                if (err.message) {
                    jsonString = Response.Success(err.message, err);
                } else {
                    jsonString = Response.Success("Login failed.", err);
                }
                reject(jsonString);
            },
        });
    });
};

module.exports.UpdateProfile = (json, username) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var params = {
            UserAttributes: [/* required */
                /* more items */
            ],
            UserPoolId: poolData.UserPoolId, /* required */
            Username: username, /* required */
        };

        if (json.locale && json.locale != "") {
            params.UserAttributes.push({
                Name: 'locale',
                Value: json.locale
            })
        }

        if (json.name && json.name != "") {
            params.UserAttributes.push({
                Name: 'name',
                Value: json.name
            })
        }

        if (json.phone && json.phone != "") {
            params.UserAttributes.push({
                Name: 'phone_number',
                Value: json.phone
            })
        }

        if (json.pictureUrl && json.pictureUrl != "") {
            params.UserAttributes.push({
                Name: 'picture',
                Value: json.pictureUrl
            })
        }

        if (json.address && json.address != "") {
            params.UserAttributes.push({
                Name: 'address',
                Value: json.address
            })
        }

        if (json.bday && json.bday != "") {
            params.UserAttributes.push({
                Name: 'birthdate',
                Value: json.bday
            })
        }

        if (json.gender && json.gender != "") {
            params.UserAttributes.push({
                Name: 'gender',
                Value: json.gender
            })
        }

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });
        cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
            if (err) {
                if (err.message) {
                    jsonString = Response.Error(err.message, err);
                } else {
                    jsonString = Response.Error("Failed to update attributes.", err);
                }
                reject(jsonString);
            } else {
                jsonString = Response.Success("Successfully updated attributes.", undefined);
                resolve(jsonString);
            }
        });


    });
};

module.exports.ChangePassword = (username, oldPassword, newPassword, access_token) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var params = {
            AccessToken: access_token, /* required */
            PreviousPassword: oldPassword, /* required */
            ProposedPassword: newPassword /* required */
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });

        cognitoidentityserviceprovider.changePassword(params, function (err, data) {
            if (err) {
                if (err.message) {
                    jsonString = Response.Error(err.message, err);
                } else {
                    jsonString = Response.Error("Failed to change password.", err);
                }
                reject(jsonString);
            } else {
                jsonString = Response.Success("Successfully changed the password.", undefined);
                resolve(jsonString);
            }
        });
    });
};

module.exports.InitForgotPassword = (username) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });

        var params = {
            ClientId: poolData.ClientId, /* required */
            Username: username, /* required */
        };


        cognitoidentityserviceprovider.forgotPassword(params, function (err, data) {
            if (err) {
                if (err.message) {
                    jsonString = Response.Error(err.message, err);
                } else {
                    jsonString = Response.Error("Failed to initiate forgot password.", err);
                }
                reject(jsonString);
            } else {
                jsonString = Response.Success("Successfully initiated forgot password flow.", undefined);
                resolve(jsonString);
            }
        });
    });
};

module.exports.ConfirmForgotPassword = (username, code, password) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var params = {
            ClientId: poolData.ClientId, /* required */
            ConfirmationCode: code, /* required */
            Password: password, /* required */
            Username: username, /* required */
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });

        cognitoidentityserviceprovider.confirmForgotPassword(params, function (err, data) {
            if (err) {
                if (err.message) {
                    jsonString = Response.Error(err.message, err);
                } else {
                    jsonString = Response.Error("Failed to reseted password.", err);
                }
                reject(jsonString);
            } else {
                jsonString = Response.Success("Successfully reseted the password.", undefined);
                resolve(jsonString);
            }
        });
    });
};

module.exports.DeleteUser = (username) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var params = {
            UserPoolId: poolData.UserPoolId, /* required */
            Username: username /* required */
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });

        cognitoidentityserviceprovider.adminDeleteUser(params, function (err, data) {
            if (err) {
                if (err.message) {
                    jsonString = Response.Error(err.message, err);
                } else {
                    jsonString = Response.Error("Failed to delete user.", err);
                }
                reject(jsonString);
            } else {
                ClientUserService.Delete({email: username})
                ClientUserService.Delete({phone_number: username})
                jsonString = Response.Success("Successfully deleted user.", undefined);
                resolve(jsonString);
            }
        });


    });
};

module.exports.GetUser = (username) => {
    return new Promise(function (resolve, reject) {
        var jsonString;

        var params = {
            UserPoolId: poolData.UserPoolId, /* required */
            Username: username /* required */
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
            region: pool_region, credentials: {
                "accessKeyId": config.Cognito.IAM_Access_Key,
                "secretAccessKey": config.Cognito.IAM_Secret_Key
            }
        });

        cognitoidentityserviceprovider.adminGetUser(params, function (err, data) {
            if (err) {
                if (err.message) {
                    if (err.message.includes("User does not exist")) {
                        jsonString = Response.Success("User does not exist.", err);
                        resolve(jsonString);
                    } else {
                        jsonString = Response.Error(err.message, err);
                    }
                } else {
                    jsonString = Response.Error("Failed to get user.", err);
                }
                reject(jsonString);
            } else {
                let outJson = {};
                for (let item of data.UserAttributes) {
                    outJson[item.Name] = item.Value;
                }
                jsonString = Response.Success("Successfully get user.", outJson);
                resolve(jsonString);
            }
        });


    });
};

module.exports.GetNewTokens = (req, res) => {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: req.body.refresh_token});

    var poolData = {
        UserPoolId: config.Cognito.UserPoolId,
        ClientId: config.Cognito.ClientId
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: req.body.email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            console.log(err);
            res.status(400);
            if (err.message) {
                res.send(Response.Error(err.message, err));
            } else {
                res.send(Response.Error("Error getting new tokens.", err));
            }
        } else {
            let retObj = {
                "access_token": session.accessToken.jwtToken,
                "id_token": session.idToken.jwtToken,
                "refresh_token": session.refreshToken.token,
            }
            res.send(Response.Success("Successfully renewed tokens.", retObj));
        }
    })
};





