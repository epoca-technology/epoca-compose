// Init Environment Class
import {Environment, IEnvironment} from "./Environment"
const _environment: IEnvironment = new Environment();

// Init CLI
console.log(" ");
console.log("GENERATE ENVIRONMENT");
console.log(" ");



function main(): void {
    // Generate the environment and display the info
    const info: string = _environment.generateEnvironment();
    console.log(" ");
    console.log(info);
    console.log(" ");
}



// Execute the function
main();