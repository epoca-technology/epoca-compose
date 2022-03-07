// Dependencies 
import {execute} from "@getvim/execute";

// Init CLI
console.log('');
console.log('DATABASE BACKUP');
console.log(' ');




async function main(): Promise<void> {
    // Init values
    const name: string = String(Date.now() + '.dump');

    // Dump the Database
    try {
        console.log(' ');
        console.log('1/2) Dumping database into the pgdata-management volume...');
        await execute(`docker exec postgres docker-entrypoint.sh pg_dump -U postgres -f /var/lib/pgdata-management/${name} -Fc`);
        console.log(`Database Backup ${name} was dumped successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 1: ', e);
        throw e;
    }

    // Upload it to Firebase Storage
    try {
        console.log(' ');
        console.log('2/2) Uploading database dump to Firebase Storage...');
        await execute(`docker exec api node dist/cli/databaseManagement.js backup ${name}`);
        console.log(`The Database Backup ${name} has been uploaded successfully.`);
        console.log(' ');
    } catch (e) {
        console.error('Error in task 2: ', e);
        throw e;
    }
}




// Execute the function
main()
.then(() => {
    process.exit(0);
})
.catch(e => { 
    process.exit(1);
});
