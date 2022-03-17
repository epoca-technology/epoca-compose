"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies 
var prompt = require("prompt");
// Init God Class
var Password_1 = require("./Password");
var _password = new Password_1.Password();
// Init CLI
console.log('GENERATE PASSWORD');
console.log('@param passwordLength  // e.g: 50 | Defaults to 50');
console.log('@param numbers         // e.g: y or n | Defaults to y');
console.log('@param symbols         // e.g: y or n | Defaults to y');
console.log('@param lowercase       // e.g: y or n | Defaults to y');
console.log('@param uppercase       // e.g: y or n | Defaults to y');
console.log(' ');
prompt.start();
prompt.get(['passwordLength', 'numbers', 'symbols', 'lowercase', 'uppercase'], function (e, data) {
    if (e)
        throw e;
    // Generate the password based on provided params or defaults
    var password = _password.generatePassword({
        length: getNumberValue(data.passwordLength),
        numbers: getBooleanValue(data.numbers),
        symbols: getBooleanValue(data.symbols),
        lowercase: getBooleanValue(data.lowercase),
        uppercase: getBooleanValue(data.uppercase),
    });
    // Output it on the console
    console.log(' ');
    console.log('====================================================================');
    console.log('GENERATED PASSWORD');
    console.log("Date: ".concat(new Date().toDateString()));
    console.log("Password: ".concat(password));
    console.log('====================================================================');
    console.log(' ');
});
/**
 * Given a config parameter in string format, it will determine the
 * number value to be returned.
 * @param configParam
 * @returns number
 */
function getNumberValue(configParam) {
    if (typeof configParam == "string" && configParam.length) {
        var val = Number(configParam);
        if (val >= 7) {
            return val;
        }
        else {
            throw new Error("The length of the password must be at least 7, the provided value is invalid: ".concat(configParam));
        }
    }
    else {
        return 50;
    }
}
/**
 * Given a config parameter in string format, it will determine if
 * the value is true or false.
 * @param configParam
 * @returns boolean
 */
function getBooleanValue(configParam) {
    if (typeof configParam == "string" && configParam.length) {
        return configParam == 'y';
    }
    else {
        return true;
    }
}
