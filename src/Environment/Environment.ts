import * as fs from "fs";
import { 
    IEnvironment, 
    IEnvironmentObject, 
    IOutputPaths,
    IOutputFiles
} from "./interfaces";
import { v4 as uuidv4 } from 'uuid';
import * as stringify from 'json-stable-stringify';



export class Environment implements IEnvironment {
    // File Paths
    private readonly path: string = `./environment`;
    private readonly source: string = `${this.path}/source.json`;
    private readonly outPath: string = `${this.path}/output`;
    private readonly output: IOutputPaths = {
        source: `${this.outPath}/source.json`,
        info: `${this.outPath}/info.txt`,
        index: `${this.outPath}/index.txt`,
        container: `${this.outPath}/container.env`,
        linux: `${this.outPath}/linux.txt`,
        windows: `${this.outPath}/windows.txt`,
    }

    // Default Environment Object
    private readonly defaultEnvironment: IEnvironmentObject = {production: false};



    constructor() { }





    /**
     * Generates all the environment variables from the file placed in the
     * input directory. Once the files have been generated, it will make sure
     * they data has maintained its integrity.
     * @returns string
     */
    public generateEnvironment(): string {
        // Initialize the directories in case they dont exist
        this.initializeEnvironmentDirectories();
        
        // Retrieve the source environment object
        const sourceEnvironment: IEnvironmentObject = this.getEnvironmentObjectFromSource();

        // Build the output files
        const outputFiles: IOutputFiles = this.buildOutputFiles(sourceEnvironment);
        
        // Create the source file in the output directory
        this.writeFile(this.output.source, JSON.stringify(sourceEnvironment, null, 4));

        // Create the other output files
        for (let key in outputFiles) { this.writeFile(this.output[key], outputFiles[key]) }

        // Validate the integrity of output
        this.validateIntegrity(sourceEnvironment);

        // Reset the source file
        this.resetSource();

        // Return the Info
        return outputFiles.info;
    }










    /* File Builder */




    /**
     * Based on the object extracted from the source, it will build the 
     * output files.
     * @param env 
     * @returns IOutputFiles
     */
    private buildOutputFiles(env: IEnvironmentObject): IOutputFiles {
        // Initialize the keys
        const keys: string[] = Object.keys(env);
        if (!keys.length) {
            console.log(env);
            throw new Error('Couldnt build the output files because the environment object doesnt have valid keys.');
        }

        // Init Files
        const info: string = this.buildInfoFile();
        let index: string = '';
        let container: string = '';
        let linux: string = '';
        let windows: string = '';

        // Init Helpers
        const suffix: string = ' && ';

        // Build the Files
        let key: string;
        let value: any;
        for (let i = 0; i < keys.length; i++) {
            // Init key/val
            key = keys[i];
            value = typeof env[key] == "object" ? JSON.stringify(env[key]) : env[key];

            // Container Environment File
            container += `${key}=${value}\n`;

            // Index File
            index += `${key}\n${value}\n\n\n`;

            // Linux File
            linux += `export ${key}='${value}'`;

            // Windows File
            windows += `set ${key}='${value}'`;

            // Add the suffix unless it reached the end
            if (i != keys.length - 1) {
                linux += suffix;
                windows += suffix;
            }
        } 


        // Return the files
        return {
            info: info,
            index: index,
            container: container,
            linux: linux,
            windows: windows
        }
    }







    /**
     * Builds the environment info file.
     * @returns string
     */
    private buildInfoFile(): string { 
        // Init meta data
        const id: string = uuidv4();
        const date: string = new Date().toDateString();

        // Build the File
        let info: string = 'ENVIRONMENT INFO\n\n';
        info += `ID: ${id}\n\n`;
        info += `Date: ${date}\n\n`;
        info += 'Files:\n';
        for (let key in this.output) { info += `${this.output[key]}\n` }
        return info;
    }














    /* Integrity Validation */





    /**
     * Retrieves the generated linux file and compares its contents 
     * with the source file.
     * @param env 
     * @returns void
     */
    private validateIntegrity(env: IEnvironmentObject): void {
        // Retrieve the linux output file
        const linux: string = this.readFile(this.output.linux);

        // Initialize the env obj that will be extracted from the linux file
        let extractedEnv: IEnvironmentObject = {};

        // Iterate over each value in the linux file and populated the object with string values
        let vars: string[] = linux.split(' && ');
        for (let v of vars) {
            const raw = v.replace('export ', '').split("='");
            extractedEnv[raw[0]] = raw[1].replace("'", '');
        }

        // Iterate over the source environment and make sure all properties are equal
        for (let key in env) { this.validatePropertyIntegrity(key, env[key], extractedEnv[key]) }
    }






    /**
     * Verifies that an environment variable is the as the one extracted
     * from the environment output. If there is a missmatch of any kind 
     * it will throw an error.
     * @param key 
     * @param original 
     * @param extracted 
     * @returns void
     */
    private validatePropertyIntegrity(key: string, original: string|number|boolean|object, extracted: string): void {
        // Handle the validation based on the type
        const type: string = typeof original;
        switch(type) {
            case "boolean":
                if (original != (extracted == 'true')) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error(`Boolean Integrity Validation Failed: ${key}.`);
                }
                break;
            case "number":
                if (original != Number(extracted)) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error(`Number Integrity Validation Failed: ${key}.`);
                }
                break;
            case "object":
                const extractedObj: object = JSON.parse(extracted);
                if (stringify(original) != stringify(extractedObj)) {
                    console.log(original);
                    console.log(extractedObj);
                    throw new Error(`Object Integrity Validation Failed: ${key}.`);
                }
                break;
            case "string":
                if (original != extracted) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error(`String Integrity Validation Failed: ${key}.`);
                }
                break;
            default:
                throw new Error(`The property (${key}) has an invalid type (${type}).`);
        }
    }












    



    /* Source Handling */





    /**
     * Retrieves the source file in an object format. It throws an error
     * if the file doesnt exist or if the contents are not valid.
     * @returns IEnvironmentObject
     */
    private getEnvironmentObjectFromSource(): IEnvironmentObject {
        // Retrieve the raw source
        const sourceRaw: string = this.readFile(this.source);

        // Make sure it is valid
        if (typeof sourceRaw == "string" && sourceRaw.length) {
            try {
                // Convert it into an object and return it
                return JSON.parse(sourceRaw);
            } catch (e) {
                console.error(e);
                throw new Error('The source content could not be converted into a JSON Object.');
            }
        } else {
            console.log(sourceRaw);
            throw new Error(`The extracted source is not a valid string.`)
        }
    }






    /**
     * Once the environment is generated successfully, reset the source
     * file for security reasons.
     * @returns void
     */
    private resetSource(): void { this.writeFile(this.source, JSON.stringify(this.defaultEnvironment, null, 4)) }












    /* Initializer */






    /**
     * Checks if all the directories exist, otherwise it creates them.
     */
    private initializeEnvironmentDirectories(): void {
        // Create the environment and output directories if they don't exist
        fs.mkdirSync('./environment', {recursive: true});
        fs.mkdirSync('./environment/output', {recursive: true});

        // Check if the source file exists, otherwise create it
        try {
            fs.readFileSync(this.source, { encoding: 'utf-8' });
        } catch (e) {
            // If an error is thrown, create the file
            this.resetSource();
        }
    }












    /* File Handling */






    /**
     * Reads the file located at the given path. If no file is found, throws an error.
     * @param path 
     * @returns string
     */
    private readFile(path: string): string { return fs.readFileSync(path, { encoding: 'utf-8' }) }







    /**
     * Writes a file in the provided path with the provided content.
     * @param path 
     * @param content 
     * @returns void
     */
    private writeFile(path: string, content: string): void { fs.writeFileSync(path, content, { flag: 'w' }) }
}