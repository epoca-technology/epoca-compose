const {src, dest, task, series} = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const minify = require('gulp-minify');
const clean = require('gulp-clean');



/* BUILD CLI */


// Compiles the typescript code into javascript.
task('compile', () => { return tsProject.src().pipe(tsProject()).js.pipe(dest("dist")) });



// Compresses the javascript code.
task('compress', () => {
    return src(['dist/**/*.js'])
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            }
        }))
        .pipe(dest('dist'))
});



// Deletes the dist directory so the new code can be introduced.
task('cleanDist', () => { return src('dist', {allowEmpty: true}).pipe(clean({force: true})) });




// Build CLI Series: Clean, Compile & Compress
exports.buildCLI = series('cleanDist', 'compile', 'compress');













/* DOCKER COMPOSE FILE (DCF) */




// Deletes the dist directory so the new code can be introduced.
task('cleanDockerComposeFile', () => { return src('./docker-compose.yml', {allowEmpty: true}).pipe(clean({force: true})) });




// Sets the appropiate docker-compose.yml file
task('defaultModeDockerComposeFile', () => { return setDockerComposeFile('default-mode') });
task('debugModeDockerComposeFile', () => { return setDockerComposeFile('debug-mode') });
task('testModeDockerComposeFile', () => { return setDockerComposeFile('test-mode') });
task('restoreModeDockerComposeFile', () => { return setDockerComposeFile('restore-mode') });


// Docker Compose File Series: Clean, Compile & Compress
exports.defaultModeDCF = series('cleanDockerComposeFile', 'defaultModeDockerComposeFile');
exports.debugModeDCF = series('cleanDockerComposeFile', 'debugModeDockerComposeFile');
exports.testModeDCF = series('cleanDockerComposeFile', 'testModeDockerComposeFile');
exports.restoreModeDCF = series('cleanDockerComposeFile', 'restoreModeDockerComposeFile');




/*
* Sets the correct docker-compose.yml at the root of the project in order to be used.
* @param mode 'default'|'debug-mode'|'test-mode'|'restore-mode'
* */
function setDockerComposeFile(mode) { return src('./docker-compose/' + mode +'/docker-compose.yml').pipe(dest('./')) }