// Dependencies 
//import * as prompt from 'prompt';

// Init God Class
import {Environment, IEnvironment} from "./Environment"
const _environment: IEnvironment = new Environment();

// Init CLI
console.log('GENERATE ENVIRONMENT');
console.log(' ');
//prompt.start();






async function main(args: string[]) {
    // Init the name
    const name: string = args.slice(2)[0];
    if (typeof name != "string" || !name.length) {
        throw new Error(`The backup name must be provided as an argumen. F.e: npm run restore-database DUMP_NAME.dump`);
    }
    console.log(name);
}









// Execute the function
main(process.argv)
.then(() => {
    console.log(' ');
    console.log('The script was executed succcessfully.');
})
.catch(e => console.error)