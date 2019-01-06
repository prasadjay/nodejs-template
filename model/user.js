var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
const common = require('./../common/common');

var userSchema = new Schema({
    platform: {type: String, enum: ['email', 'facebook', 'google', 'linkedin'], default: 'email', required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    // name: {type: String, required: true},
    // picture: {type: String, default:common.GetDefaultAvatar},
    // gender: {type: String, enum: ['male', 'female'], default: 'other'},
    // birthdate: {type: String, default:'n/a'},
    // locale: {type: String, default:'n/a'},
    // state: {type: String, default:'n/a'},
    // city: {type: String, default:'n/a'},
    // phone_number: {type: String, unique: true},
    // created_at: {type: Date, default: Date.now, required: true},
    // updated_at: {type: Date, default: Date.now, required: true}
});

module.exports.User = userSchema;

