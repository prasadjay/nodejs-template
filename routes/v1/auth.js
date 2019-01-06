const express = require('express');
const validate = require('express-validation');
const controller = require('../../controller/auth');
const {
    login,
    register,
    oAuth,
    refresh,
} = require('../../validations/auth');

const router = express.Router();

/**
 * User registration
 */
//router.route('/signup').post(validate(register), controller.Signup);
router.route('/signup').post(controller.Signup);
module.exports = router;
