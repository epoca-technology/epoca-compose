// Dependencies 
import {execute} from "@getvim/execute";
import * as prompt from 'prompt';

// Init CLI
console.log('');
console.log('DATABASE RESTORE');
console.log('@param backupName  // F.e: 1646678127337.dump');
console.log(' ');
prompt.start();




prompt.get(['backupName'], async (e: any, data: prompt.Properties) => {
    if (e) throw e;

    // Init the name
    const name: string = <string>data.backupName;
    if (typeof name != "string" || !name.length) {
        throw new Error(`The backup name must be provided as an argument. F.e: npm run restore-database DUMP_NAME.dump`);
    }

    // Download the Database Backup and place it in the volume
    try {
        console.log(' ');
        console.log('1/3) Downloading the Database Backup into the pgdata-management volume...');
        await execute(`docker exec api node dist/cli/databaseManagement.js restore ${name}`);
        console.log(`The Database Backup ${name} was downloaded successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 1: ', e);
        throw e;
    }


    // Restore the downloaded db
    try {
        console.log(' ');
        console.log('2/3) Restoring the Database Backup...');
        await execute(`docker exec postgres docker-entrypoint.sh pg_restore --clean -U postgres -d postgres /var/lib/pgdata-management/${name}`);
        console.log(`The Database Backup ${name} has been restored successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 2: ', e);
        throw e;
    }


    // Clean the Database Management Files
    try {
        console.log(' ');
        console.log('3/3) Cleaning Database Management Files...');
        await execute(`docker exec api node dist/cli/databaseManagement.js clean`);
        console.log(`The management files have beel cleaned successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 3: ', e);
        throw e;
    }
});