"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
var fs = require("fs");
var uuid_1 = require("uuid");
var stringify = require("json-stable-stringify");
var Environment = /** @class */ (function () {
    function Environment() {
        // File Paths
        this.path = "./environment";
        this.source = "".concat(this.path, "/source.json");
        this.outPath = "".concat(this.path, "/output");
        this.output = {
            source: "".concat(this.outPath, "/source.json"),
            info: "".concat(this.outPath, "/info.txt"),
            index: "".concat(this.outPath, "/index.txt"),
            container: "".concat(this.outPath, "/container.env"),
            linux: "".concat(this.outPath, "/linux.txt"),
            windows: "".concat(this.outPath, "/windows.txt"),
        };
        // Default Environment Object
        this.defaultEnvironment = { production: false };
    }
    /**
     * Generates all the environment variables from the file placed in the
     * input directory. Once the files have been generated, it will make sure
     * they data has maintained its integrity.
     * @returns string
     */
    Environment.prototype.generateEnvironment = function () {
        // Initialize the directories in case they dont exist
        this.initializeEnvironmentDirectories();
        // Retrieve the source environment object
        var sourceEnvironment = this.getEnvironmentObjectFromSource();
        // Build the output files
        var outputFiles = this.buildOutputFiles(sourceEnvironment);
        // Create the source file in the output directory
        this.writeFile(this.output.source, JSON.stringify(sourceEnvironment, null, 4));
        // Create the other output files
        for (var key in outputFiles) {
            this.writeFile(this.output[key], outputFiles[key]);
        }
        // Validate the integrity of output
        this.validateIntegrity(sourceEnvironment);
        // Reset the source file
        this.resetSource();
        // Return the Info
        return outputFiles.info;
    };
    /* File Builder */
    /**
     * Based on the object extracted from the source, it will build the
     * output files.
     * @param env
     * @returns IOutputFiles
     */
    Environment.prototype.buildOutputFiles = function (env) {
        // Initialize the keys
        var keys = Object.keys(env);
        if (!keys.length) {
            console.log(env);
            throw new Error('Couldnt build the output files because the environment object doesnt have valid keys.');
        }
        // Init Files
        var info = this.buildInfoFile();
        var index = '';
        var container = '';
        var linux = '';
        var windows = '';
        // Init Helpers
        var suffix = ' && ';
        // Build the Files
        var key;
        var value;
        for (var i = 0; i < keys.length; i++) {
            // Init key/val
            key = keys[i];
            value = typeof env[key] == "object" ? JSON.stringify(env[key]) : env[key];
            // Container Environment File
            container += "".concat(key, "=").concat(value, "\n");
            // Index File
            index += "".concat(key, "\n").concat(value, "\n\n\n");
            // Linux File
            linux += "export ".concat(key, "='").concat(value, "'");
            // Windows File
            windows += "set ".concat(key, "='").concat(value, "'");
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
        };
    };
    /**
     * Builds the environment info file.
     * @returns string
     */
    Environment.prototype.buildInfoFile = function () {
        // Init meta data
        var id = (0, uuid_1.v4)();
        var date = new Date().toDateString();
        // Build the File
        var info = 'ENVIRONMENT INFO\n\n';
        info += "ID: ".concat(id, "\n\n");
        info += "Date: ".concat(date, "\n\n");
        info += 'Files:\n';
        for (var key in this.output) {
            info += "".concat(this.output[key], "\n");
        }
        return info;
    };
    /* Integrity Validation */
    /**
     * Retrieves the generated linux file and compares its contents
     * with the source file.
     * @param env
     * @returns void
     */
    Environment.prototype.validateIntegrity = function (env) {
        // Retrieve the linux output file
        var linux = this.readFile(this.output.linux);
        // Initialize the env obj that will be extracted from the linux file
        var extractedEnv = {};
        // Iterate over each value in the linux file and populated the object with string values
        var vars = linux.split(' && ');
        for (var _i = 0, vars_1 = vars; _i < vars_1.length; _i++) {
            var v = vars_1[_i];
            var raw = v.replace('export ', '').split("='");
            extractedEnv[raw[0]] = raw[1].replace("'", '');
        }
        // Iterate over the source environment and make sure all properties are equal
        for (var key in env) {
            this.validatePropertyIntegrity(key, env[key], extractedEnv[key]);
        }
    };
    /**
     * Verifies that an environment variable is the as the one extracted
     * from the environment output. If there is a missmatch of any kind
     * it will throw an error.
     * @param key
     * @param original
     * @param extracted
     * @returns void
     */
    Environment.prototype.validatePropertyIntegrity = function (key, original, extracted) {
        // Handle the validation based on the type
        var type = typeof original;
        switch (type) {
            case "boolean":
                if (original != (extracted == 'true')) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error("Boolean Integrity Validation Failed: ".concat(key, "."));
                }
                break;
            case "number":
                if (original != Number(extracted)) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error("Number Integrity Validation Failed: ".concat(key, "."));
                }
                break;
            case "object":
                var extractedObj = JSON.parse(extracted);
                if (stringify(original) != stringify(extractedObj)) {
                    console.log(original);
                    console.log(extractedObj);
                    throw new Error("Object Integrity Validation Failed: ".concat(key, "."));
                }
                break;
            case "string":
                if (original != extracted) {
                    console.log(original);
                    console.log(extracted);
                    throw new Error("String Integrity Validation Failed: ".concat(key, "."));
                }
                break;
            default:
                throw new Error("The property (".concat(key, ") has an invalid type (").concat(type, ")."));
        }
    };
    /* Source Handling */
    /**
     * Retrieves the source file in an object format. It throws an error
     * if the file doesnt exist or if the contents are not valid.
     * @returns IEnvironmentObject
     */
    Environment.prototype.getEnvironmentObjectFromSource = function () {
        // Retrieve the raw source
        var sourceRaw = this.readFile(this.source);
        // Make sure it is valid
        if (typeof sourceRaw == "string" && sourceRaw.length) {
            try {
                // Convert it into an object and return it
                return JSON.parse(sourceRaw);
            }
            catch (e) {
                console.error(e);
                throw new Error('The source content could not be converted into a JSON Object.');
            }
        }
        else {
            console.log(sourceRaw);
            throw new Error("The extracted source is not a valid string.");
        }
    };
    /**
     * Once the environment is generated successfully, reset the source
     * file for security reasons.
     * @returns void
     */
    Environment.prototype.resetSource = function () { this.writeFile(this.source, JSON.stringify(this.defaultEnvironment, null, 4)); };
    /* Initializer */
    /**
     * Checks if all the directories exist, otherwise it creates them.
     */
    Environment.prototype.initializeEnvironmentDirectories = function () {
        // Create the environment and output directories if they don't exist
        fs.mkdirSync('./environment', { recursive: true });
        fs.mkdirSync('./environment/output', { recursive: true });
        // Check if the source file exists, otherwise create it
        try {
            fs.readFileSync(this.source, { encoding: 'utf-8' });
        }
        catch (e) {
            // If an error is thrown, create the file
            this.resetSource();
        }
    };
    /* File Handling */
    /**
     * Reads the file located at the given path. If no file is found, throws an error.
     * @param path
     * @returns string
     */
    Environment.prototype.readFile = function (path) { return fs.readFileSync(path, { encoding: 'utf-8' }); };
    /**
     * Writes a file in the provided path with the provided content.
     * @param path
     * @param content
     * @returns void
     */
    Environment.prototype.writeFile = function (path, content) { fs.writeFileSync(path, content, { flag: 'w' }); };
    return Environment;
}());
exports.Environment = Environment;
