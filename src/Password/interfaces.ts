import { GenerateOptions } from "generate-password";



export interface IPassword {
    // Generators
    generatePassword(options?: GenerateOptions): string,

    // Validations
    passwordValid(password: string, passwordLength: number): boolean,
}




