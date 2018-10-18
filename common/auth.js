const nJwt = require('njwt');
const config = require("config");
const response = require("./response");
const regex = require('regex-email');

module.exports.CreateJWT = (data) => {
    var claims = {
        iss: "https://clackey.com",
        sub: data.email,
        scope: data.type,
        name: data.name,
        country: data.country,
        contactno: data.contactNo,
        username: data.username,
        email: data.email,
    }
    let jwt = nJwt.create(claims, config.auth.signingKey);
    jwt.setExpiration(new Date().getTime() + (config.auth.maxSessionTime * 60 * 60 * 1000));
    return jwt.compact();
}

module.exports.ValidateJWT = (req) => {
    return new Promise(function (resolve, reject) {
        if (req.headers.hasOwnProperty("authorization")) {
            nJwt.verify(req.headers.authorization, config.auth.signingKey, (err, verifiedJwt) => {
                if (err) {
                    reject(response.Error("Invalid access token.", err));
                } else {
                    resolve(response.Success("Successfully validated access token.", verifiedJwt));
                }
            });
        } else {
            reject(response.Error("No token found. Please supply JWT token in Authorization header. ex: Authorization : <JWT>", undefined));
        }
    })
}


module.exports.Login = (req, res) => {
    let platform = req.body.platform;
    let token = req.body.token;
    let user = req.body.user;
    let password = req.body.password;


    if (regex.test(user)) {//email has been entered.
        res.send(response.Success("Successfully login", data));
    } else {//username has been entered.
        res.status(400);
        res.send(response.Error("Invalid email.", undefined));
    }


}

module.exports.Register = (req, res) => {
    console.log(req.body);
    let email = req.body.email;
    let name = req.body.name;
    let passportno = req.body.passportno;
    let country = req.body.country;
    let contactno = req.body.contactno;
    let username = req.body.username;
    let password = req.body.password;

    if (regex.test(email)) {
        res.send(response.Success("Successfully registered.", data));
        //res.status(400);
        //res.send(response.Error(err.message, err));
    } else {
        res.status(400);
        res.send(response.Error("Invalid email.", undefined));
    }
}