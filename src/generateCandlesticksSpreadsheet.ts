// Dependencies 
import {execute} from "@getvim/execute";

// Init CLI
console.log('');
console.log('GENERATE CANDLESTICKS SPREADSHEET');
console.log(' ');




async function main(): Promise<void> {
    // Init values
    const name: string = String(Date.now() + '.csv');

    // Upload it to Firebase Storage
    try {
        console.log(' ');
        console.log('1/1) Generating and uploading spreadsheet...');
        await execute(`docker exec api node dist/cli/generateCandlesticksSpreadsheet.js ${name}`);
        console.log(`The Candlesticks Spreadsheet ${name} has been generated and uploaded successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 1: ', e);
        throw e;
    }
}




// Execute the function
main().then(() => { process.exit(0) }).catch(e => { process.exit(1) });
