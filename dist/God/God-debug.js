"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.God = void 0;
var otplib_1 = require("otplib");
var Password_1 = require("../Password");
var uuid_1 = require("uuid");
var God = /** @class */ (function () {
    function God() {
        // Password Instance
        this._password = new Password_1.Password();
    }
    /* Skeleton Builder */
    /**
     * Given an email address, it will build the God's skeleton
     * that will be placed in the environment file.
     * @param email
     * @returns IGodSkeleton
     */
    God.prototype.buildSkeleton = function (email) {
        // Make sure the email is valid
        if (!this.emailValid(email))
            throw new Error("The provided email is invalid: ".concat(email));
        // Init the uid
        var uid = (0, uuid_1.v4)();
        if (!(0, uuid_1.validate)(uid) || (0, uuid_1.version)(uid) != 4)
            throw new Error("The generated uid is invalid: ".concat(uid));
        // Generate a secure password and validate it
        var password = this._password.generatePassword();
        // Generate an OTP Secret and validate it
        var secret = this.generateOTPSecret();
        if (!this.otpSecretValid(secret))
            throw new Error("The generated OTP Secret is invalid: ".concat(secret));
        // Generate a test OTP Token and make sure it is valid
        var token = this.generateOTPToken(secret);
        if (!this.otpTokenValid(token, secret))
            throw new Error("The generated OTP Token is invalid: ".concat(token));
        // Return the build
        return {
            buildDate: new Date().toDateString(),
            uid: uid,
            email: email.toLowerCase(),
            password: password,
            otpSecret: secret
        };
    };
    /* Generators */
    /**
     * Generates an OTP Secret.
     * @returns string
     */
    God.prototype.generateOTPSecret = function () { return otplib_1.authenticator.generateSecret(); };
    /**
     * Generates an OTP Token.
     * @param secret
     * @returns string
     */
    God.prototype.generateOTPToken = function (secret) {
        if (!this.otpSecretValid(secret))
            throw new Error("Cannot generate an OTP Token with an invalid secret: ".concat(secret));
        return otplib_1.authenticator.generate(secret);
    };
    /* Validations */
    /*
    * Verifies if a email is valid.
    * @param email
    * @returns boolean
    * */
    God.prototype.emailValid = function (email) {
        // Check the type
        if (typeof email == "string") {
            // Check if the email is valid
            var regx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return regx.test(email);
        }
        else {
            return false;
        }
    };
    /**
     * Verifies that an OTP Secret is valid.
     * @param secret
     * @returns boolean
     */
    God.prototype.otpSecretValid = function (secret) {
        return typeof secret == "string" && secret.length >= 10 && secret.length <= 32;
    };
    /**
     * Verifies that a provided OTP token is valid and was derived from the
     * proper secret.
     * @param token
     * @param secret
     * @returns boolean
     */
    God.prototype.otpTokenValid = function (token, secret) {
        if (typeof token != "string" || token.length != 6 || !/[0-9]/.test(token))
            return false;
        if (!this.otpSecretValid(secret))
            throw new Error("Cannot check an OTP Token with an invalid secret: ".concat(secret));
        return otplib_1.authenticator.check(token, secret);
    };
    return God;
}());
exports.God = God;
