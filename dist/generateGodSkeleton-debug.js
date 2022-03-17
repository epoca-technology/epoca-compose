"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies 
var prompt = require("prompt");
// Init God Class
var God_1 = require("./God");
var _god = new God_1.God();
// Init CLI
console.log('GENERATE GOD SKELETON');
console.log('@param email');
console.log(' ');
prompt.start();
prompt.get(['email'], function (e, data) {
    if (e)
        throw e;
    // Generate the god based on provided email
    var godSkeleton = _god.buildSkeleton(data.email);
    // Output it on the console
    console.log(' ');
    console.log('====================================================================');
    console.log('GOD SKELETON BUILD');
    console.log("Date: ".concat(godSkeleton.buildDate));
    console.log("Uid: ".concat(godSkeleton.uid));
    console.log("Email: ".concat(godSkeleton.email));
    console.log("Password: ".concat(godSkeleton.password));
    console.log("OTP Secret: ".concat(godSkeleton.otpSecret));
    console.log('====================================================================');
    console.log(' ');
});
