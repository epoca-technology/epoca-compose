"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
var generate_password_1 = require("generate-password");
var Password = /** @class */ (function () {
    function Password() {
    }
    /* Generators */
    /**
     * Generates a random password based on provided options.
     * @param options?
     * @returns string
     */
    Password.prototype.generatePassword = function (options) {
        // Init options in case they weren't provided
        options = options ? options : {};
        // Generate the password
        var password = (0, generate_password_1.generate)({
            length: typeof options.length == "number" ? options.length : 50,
            numbers: typeof options.numbers == "boolean" ? options.numbers : true,
            symbols: typeof options.symbols == "boolean" ? options.symbols : true,
            lowercase: typeof options.lowercase == "boolean" ? options.lowercase : true,
            uppercase: typeof options.uppercase == "boolean" ? options.uppercase : true,
            exclude: "\"'=",
            strict: true
        });
        // Validate the password
        if (!this.passwordValid(password))
            throw new Error("The generated password is invalid: ".concat(password));
        // Return the password
        return password;
    };
    /* Validations */
    /*
    * Verifies if a password is acceptable. The requirements are:
    * * Length: 7 - 200 characters long
    * * 1 uppercase letter
    * * 1 lowercase letter
    * * 1 number
    * @param password
    * @returns boolean
    * */
    Password.prototype.passwordValid = function (password) {
        // Init required length
        var minLength = 7;
        var maxLength = 200;
        // Check the type
        if (typeof password == "string" && password.length) {
            // Init Character Types Regex & counters
            var anUpperCase = /[A-Z]/;
            var aLowerCase = /[a-z]/;
            var aNumber = /[0-9]/;
            var numUpper = 0;
            var numLower = 0;
            var numNums = 0;
            // Iterate over the password updating the character type counters
            for (var i = 0; i < password.length; i++) {
                if (anUpperCase.test(password[i])) {
                    numUpper++;
                }
                else if (aLowerCase.test(password[i])) {
                    numLower++;
                }
                else if (aNumber.test(password[i])) {
                    numNums++;
                }
            }
            // Make sure all requirements have been met
            return numUpper > 0 &&
                numLower > 0 &&
                numNums > 0 &&
                password.length >= minLength &&
                password.length <= maxLength &&
                !password.includes('=') &&
                !password.includes('"') &&
                !password.includes("'");
        }
        else {
            return false;
        }
    };
    return Password;
}());
exports.Password = Password;
