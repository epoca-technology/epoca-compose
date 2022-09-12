import { IPassword } from "./interfaces";
import {generate, GenerateOptions} from 'generate-password';


export class Password implements IPassword {

    constructor() { }





    /* Generators */





    /**
     * Generates a random password based on provided options.
     * @param options?
     * @returns string
     */
    public generatePassword(options?: GenerateOptions): string {
        // Init options in case they weren't provided
        options = options ? options: {};

        // Generate the password
        const password: string =  generate({
            length: typeof options.length == "number" ? options.length: 50,
            numbers: typeof options.numbers == "boolean" ? options.numbers: true,
            lowercase: typeof options.lowercase == "boolean" ? options.lowercase: true,
            uppercase: typeof options.uppercase == "boolean" ? options.uppercase: true,
            symbols: typeof options.symbols == "boolean" ? options.symbols: true,
            exclude: `"'=$`,
            strict: true
        });

        // Validate the password
        if (!this.passwordValid(password, options.length)) throw new Error(`The generated password is invalid: ${password}`);

        // Return the password
        return password;
    }
















    /* Validations */






    /*
    * Verifies if a password is acceptable. The requirements are:
    * * Length: 7 - 200 characters long
    * * 1 uppercase letter
    * * 1 lowercase letter
    * * 1 number
    * @param password
    * @param passwordLength
    * @returns boolean
    * */
    public passwordValid(password: string, passwordLength: number): boolean {
        // Check the type
        if (typeof password == "string" && password.length == passwordLength) {
            // Init Character Types Regex & counters
            const anUpperCase: RegExp = /[A-Z]/;
            const aLowerCase: RegExp = /[a-z]/;
            const aNumber: RegExp = /[0-9]/;
            let numUpper = 0;
            let numLower = 0;
            let numNums = 0;

            // Iterate over the password updating the character type counters
            for(let i = 0; i < password.length; i++){
                if(anUpperCase.test(password[i])) { numUpper++ }
                else if(aLowerCase.test(password[i])) { numLower++ }
                else if(aNumber.test(password[i])) { numNums++ }
            }

            // Make sure all requirements have been met
            return  numUpper > 0 && 
                    numLower > 0 && 
                    numNums > 0 && 
                    !password.includes('=') &&
                    !password.includes('"') &&
                    !password.includes("'");
        } else { return false }
    }
}