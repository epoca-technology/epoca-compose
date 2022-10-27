import { IGod, IGodSkeleton } from "./interfaces";
import { authenticator } from "otplib";
import { IPassword, Password } from "../Password";
import { v4 as uuidv4, version as uuidVersion, validate as uuidValidate } from "uuid";


export class God implements IGod {
    // Password Instance
    private readonly _password: IPassword = new Password();


    constructor() { }



    /* Skeleton Builder */





    /**
     * Given an email address, it will build the God"s skeleton
     * that will be placed in the environment file.
     * @param email 
     * @returns IGodSkeleton
     */
    public buildSkeleton(email: string): IGodSkeleton {
        // Make sure the email is valid
        if (!this.emailValid(email)) throw new Error(`The provided email is invalid: ${email}`); 

        // Init the uid
        const uid: string = uuidv4();
        if (!uuidValidate(uid) || uuidVersion(uid) != 4) throw new Error(`The generated uid is invalid: ${uid}`); 

        // Generate a secure password and validate it
        const password: string = this._password.generatePassword({length: 100, symbols: false});

        // Generate an OTP Secret and validate it
        const secret: string = this.generateOTPSecret();
        if (!this.otpSecretValid(secret)) throw new Error(`The generated OTP Secret is invalid: ${secret}`);

        // Generate a test OTP Token and make sure it is valid
        const token: string = this.generateOTPToken(secret);
        if (!this.otpTokenValid(token, secret)) throw new Error(`The generated OTP Token is invalid: ${token}`);

        // Return the build
        return {
            buildDate: new Date().toDateString(),
            uid: uid,
            email: email.toLowerCase(),
            password: password,
            otpSecret: secret
        }
    }











    /* Generators */








    /**
     * Generates an OTP Secret.
     * @returns string
     */
    public generateOTPSecret(): string { return authenticator.generateSecret() }









    /**
     * Generates an OTP Token.
     * @param secret 
     * @returns string
     */
    public generateOTPToken(secret: string): string {
        if (!this.otpSecretValid(secret)) throw new Error(`Cannot generate an OTP Token with an invalid secret: ${secret}`);
        return authenticator.generate(secret);
    }













    /* Validations */






    /*
    * Verifies if a email is valid.
    * @param email
    * @returns boolean
    * */
    public emailValid(email: string): boolean {
        // Check the type
        if (typeof email == "string") {
            // Check if the email is valid
            const regx: any = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return regx.test(email);
        } else { return false }
    }










    /**
     * Verifies that an OTP Secret is valid.
     * @param secret 
     * @returns boolean
     */
    public otpSecretValid(secret: string): boolean {
        return typeof secret == "string" && secret.length >= 10 && secret.length <= 32;
    }




    



    /**
     * Verifies that a provided OTP token is valid and was derived from the
     * proper secret.
     * @param token 
     * @param secret 
     * @returns boolean
     */
    public otpTokenValid(token: string, secret: string): boolean { 
        if (typeof token != "string" || token.length != 6 || !/[0-9]/.test(token)) return false;
        if (!this.otpSecretValid(secret)) throw new Error(`Cannot check an OTP Token with an invalid secret: ${secret}`);
        return authenticator.check(token, secret);
    }
}