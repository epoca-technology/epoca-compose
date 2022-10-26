// Dependencies 
import {execute} from "@getvim/execute";
import * as prompt from "prompt";

// Init CLI
console.log("");
console.log("DATABASE RESTORE");
console.log("@param backupName  // F.e: 1646678127337.dump");
console.log(" ");

// Extract the last argument from the command
const potentialName: string = process.argv.at(-1);



// If it is a valid name, start the process
if (isBackupName(potentialName)) {
    restoreDatabase(potentialName).then(() => { process.exit(0) }).catch(e => { process.exit(1) });
}

// Otherwise, display the prompt so the file name can be input
else {
    prompt.start();
    prompt.get(["backupName"], async (e: any, data: prompt.Properties) => {
        if (e) throw e;
        await restoreDatabase(<string>data.backupName);
    });
}





/**
 * Performs the database restore process.
 * @param backupName 
 * @returns Promise<void> 
 */
async function restoreDatabase(backupName: string): Promise<void> {
    // Validate the name
    if (!isBackupName(backupName)) {
        throw new Error(`A valid backup name must be provided through the prompt or as an argument. F.e: npm run database-restore DUMP_NAME.dump`);
    }

    // Download the Database Backup and place it in the volume
    try {
        console.log(" ");
        console.log("1/3) Downloading the Database Backup into the pgdata-management volume...");
        await execute(`docker exec api node dist/cli/databaseManagement.js restore ${backupName}`);
        console.log(`The Database Backup ${backupName} was downloaded successfully.`);
        console.log(" ");
    } catch (e) {
        console.error("Error in task 1: ", e);
        throw e;
    }


    // Restore the downloaded db
    try {
        console.log(" ");
        console.log("2/3) Restoring the Database Backup...");
        await execute(`docker exec postgres pg_restore --clean -U postgres -d postgres /var/lib/pgdata-management/${backupName}`);
        console.log(`The Database Backup ${backupName} has been restored successfully.`);
        console.log(" ");
    } catch (e) {
        console.error("Error in task 2: ", e);
        throw e;
    }


    // Clean the Database Management Files
    try {
        console.log(" ");
        console.log("3/3) Cleaning Database Management Files...");
        await execute(`docker exec api node dist/cli/databaseManagement.js clean`);
        console.log(`The management files have beel cleaned successfully.`);
        console.log(" ");
    } catch (e) {
        console.error("Error in task 3: ", e);
        throw e;
    }
}




/**
 * Verifies if a provided name is a valid backup file name.
 * @param backupName 
 * @returns boolean
 */
function isBackupName(backupName: string): boolean {
    return typeof backupName == "string" && backupName.length >= 15 && backupName.includes(".dump");
}