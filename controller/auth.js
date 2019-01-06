const regex = require('regex-email');
const UserWorker = require('../worker/UserWorker');
const common = require('../common/common');

module.exports.ValidateToken = (req, res) => {
    let excused_api_list = [
        "login",
        "register",
        "/"
    ]
}

module.exports.Login = (req, res) => {
    let user = req.body.user;
    let password = req.body.password;

    if (regex.test(user)) {//email has been entered.
        res.send(response.Success("Successfully login", data));
    } else {//username has been entered.
        res.status(400);
        res.send(response.Error("Invalid email.", undefined));
    }
}

module.exports.Signup = (req, res) => {

    res.send(req.body);
    //res.send(req.body);
    //uncomment when actually used
    /*if (req.body.platform == "email" && !regex.test(req.body.username)) {
        res.status(400);
        res.send(common.Error("Invalid email.", undefined));
    }

    UserWorker.GetOne({platform: req.body.platform, username: req.body.username}).then((result) => {
        if (result == null){
            let data = {
                platform: req.body.platform,
                username: req.body.username,
                password: common.GetMD5Hash(req.body.password),
                name: req.body.name,
                nickname: req.body.nickname,
                gender: req.body.gender,
                birthdate: req.body.birthdate,
                locale: req.body.locale,
                city: req.body.city,
                phone_number: req.body.phone_number
            }

            UserWorker.Create(data).then((result)=>{
                res.send(common.Success("Successfully registered.", result));
            }).catch((exception)=>{
                res.status(400);
                res.send(common.Error(exception.message, undefined));
            })
        }else{
            res.status(400);
            res.send(common.Error("User already exists", result));
        }
    }).catch((exception) => {
        res.status(400);
        res.send(common.Error(exception.message, undefined));
    })*/
}