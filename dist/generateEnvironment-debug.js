"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Init Environment Class
var Environment_1 = require("./Environment");
var _environment = new Environment_1.Environment();
// Init CLI
console.log(' ');
console.log('GENERATE ENVIRONMENT');
console.log(' ');
function main() {
    // Generate the environment and display the info
    var info = _environment.generateEnvironment();
    console.log(' ');
    console.log(info);
    console.log(' ');
}
// Execute the function
main();
