// Dependencies 
import {execute} from "@getvim/execute";

// Init CLI
console.log('');
console.log('BACKUP DATABASE');
console.log(' ');




async function main(): Promise<void> {
    // Init values
    const name: string = String(Date.now() + '.dump');

    // Dump the Database
    try {
        console.log('1/3) Dumping database into pgdata-management volume...');
        await execute(`docker exec postgres docker-entrypoint.sh pg_dump -U postgres -f /var/lib/pgdata-management/${name} -Fc`);
        console.log(`Database Backup ${name} was dumped successfully.`);
        console.log('');

        // Upload it to Firebase Storage
        try {
            console.log('2/3) Uploading database dump to Firebase Storage...');
            await execute(`docker exec api node dist/cli/databaseManagement.js backup ${name}`);
            console.log(`The Database Backup ${name} has been uploaded successfully.`);
            console.log(' ');
    
            // Clean the management volume
            try {
                console.log('3/3) Deleting all files inside of the pgdata-management volume...');
                await execute(`docker exec api node dist/cli/databaseManagement.js clean`);
                console.log(`The pgdata-management volume has been cleaned successfully.`);
            } catch (e) {
                console.log('Management Directory Cleanup Error: ', e);
            }
        } catch (e) {
            // Clean the management directory
            await execute(`docker exec api node dist/cli/databaseManagement.js clean`);
            console.log('Backup Error: ', e);
        }
    } catch (e) {
        console.error('Dump Error: ', e);
        throw e;
    }
}




// Execute the function
main()
.then(() => {
    process.exit(0);
})
.catch(e => { 
    console.error(e);
    process.exit(1);
})
