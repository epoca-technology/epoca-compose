// Dependencies 
import * as prompt from "prompt";

// Init God Class
import {IPassword, Password} from "./Password"
const _password: IPassword = new Password();

// Init CLI
console.log("GENERATE PASSWORD");
console.log("@param passwordLength  // e.g: 50 | Defaults to 50");
console.log("@param numbers         // e.g: y or n | Defaults to y");
console.log("@param symbols         // e.g: y or n | Defaults to y");
console.log("@param lowercase       // e.g: y or n | Defaults to y");
console.log("@param uppercase       // e.g: y or n | Defaults to y");
console.log(" ");
prompt.start();



prompt.get(["passwordLength", "numbers", "lowercase", "uppercase", "symbols"], (e: any, data: prompt.Properties) => {
    if (e) throw e;

    // Generate the password based on provided params or defaults
    const password: string = _password.generatePassword({
        length: getNumberValue(<string>data.passwordLength),
        numbers: getBooleanValue(<string>data.numbers),
        lowercase: getBooleanValue(<string>data.lowercase),
        uppercase: getBooleanValue(<string>data.uppercase),
        symbols: getBooleanValue(<string>data.symbols),
    });

    // Output it on the console
    console.log(" ");
    console.log("====================================================================");
    console.log("GENERATED PASSWORD");
    console.log(`Date: ${new Date().toDateString()}`);
    console.log(`Password: ${password}`);
    console.log("====================================================================");
    console.log(" ");
});






/**
 * Given a config parameter in string format, it will determine the
 * number value to be returned.
 * @param configParam 
 * @returns number
 */
function getNumberValue(configParam: string): number {
    if (typeof configParam == "string" && configParam.length) {
        const val: number = Number(configParam);
        if (val >= 7) {
            return val;
        } else {
            throw new Error(`The length of the password must be at least 7, the provided value is invalid: ${configParam}`);
        }
    } else { return 50 }
}






/**
 * Given a config parameter in string format, it will determine if
 * the value is true or false.
 * @param configParam 
 * @returns boolean
 */
function getBooleanValue(configParam: string): boolean {
    if (typeof configParam == "string" && configParam.length) {
        return configParam == "y";
    } else { return true }
}