// Dependencies 
import * as prompt from 'prompt';

// Init Environment Class
import {Environment, IEnvironment} from "./Environment"
const _environment: IEnvironment = new Environment();

// Init CLI
console.log('GENERATE ENVIRONMENT');
console.log(' ');
prompt.start();



prompt.get([], async (e: any, data: prompt.Properties) => {
    if (e) throw e;

    // Generate the environment and display the info
    const info: string = _environment.generateEnvironment();
    console.log(' ');
    console.log(info);
    console.log(' ');
});



