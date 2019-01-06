const mongoose = require("mongoose");
var UserModel = require('./../model/user').User;
var User = mongoose.model('user', UserModel);
const Promise = require("bluebird");

module.exports.Create = (data) => {
    return new Promise(function (resolve, reject) {
        var model = User(data);
        model.save((err, _result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(_result);
            }
        });

    })
}

module.exports.Update = (context, data) => {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate(context, data, function (err, _result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(_result);
            }
        });
    })
}

module.exports.Delete = (context) => {
    return new Promise(function (resolve, reject) {
        User.findOneAndRemove(context, function (err, _result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(_result);
            }
        });
    })
}

module.exports.GetOne = (context) => {
    return new Promise(function (resolve, reject) {
        User.findOne(context, function (err, _result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(_result);
            }
        });
    });
}

module.exports.Search = (context) => {
    return new Promise(function (resolve, reject) {
        User.find(context, function (err, _result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(_result);
            }
        });
    });
}