// Dependencies 
import * as prompt from 'prompt';


// Init God Class
import {God, IGod, IGodSkeleton} from "./God"
const _god: IGod = new God();

// Init CLI
console.log('GENERATE GOD SKELETON');
console.log('@param email');
console.log(' ');
prompt.start();


prompt.get(['email'], async (e: any, data: prompt.Properties) => {
    if (e) throw e;

    // Generate the god based on provided email
    const godSkeleton: IGodSkeleton = _god.buildSkeleton(<string>data.email);

    // Output it on the console
    console.log(' ');
    console.log('====================================================================');
    console.log('GOD SKELETON BUILD');
    console.log(`Date: ${godSkeleton.buildDate}`);
    console.log(`Uid: ${godSkeleton.uid}`);
    console.log(`Email: ${godSkeleton.email}`);
    console.log(`Password: ${godSkeleton.password}`);
    console.log(`OTP Secret: ${godSkeleton.otpSecret}`);
    console.log('====================================================================');
    console.log(' ');
});