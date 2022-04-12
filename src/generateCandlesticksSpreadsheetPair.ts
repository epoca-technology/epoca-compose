// Dependencies 
import {execute} from "@getvim/execute";

// Init CLI
console.log('');
console.log('GENERATE CANDLESTICKS SPREADSHEET PAIR');
console.log(' ');




async function main(): Promise<void> {
    try {
        console.log(' ');
        console.log('1/1) Generating candlestick spreadsheet pair...');
        await execute(`docker exec api node dist/cli/generateCandlesticksSpreadsheetPair.js`);
        console.log(`The Candlesticks Spreadsheets candlesticks.csv and forecast_candlesticks.csv have been generated successfully and stored in the candlestick-spreadsheets volume.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 1: ', e);
        throw e;
    }
}




// Execute the function
main().then(() => { process.exit(0) }).catch(e => { process.exit(1) });
