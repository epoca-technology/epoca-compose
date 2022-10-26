const {src, dest, task, series} = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const minify = require("gulp-minify");
const clean = require("gulp-clean");



/* BUILD CLI */


// Compiles the typescript code into javascript.
task("compile", () => { return tsProject.src().pipe(tsProject()).js.pipe(dest("dist")) });



// Compresses the javascript code.
task("compress", () => {
    return src(["dist/**/*.js"])
        .pipe(minify({
            ext:{
                src:"-debug.js",
                min:".js"
            }
        }))
        .pipe(dest("dist"))
});



// Deletes the dist directory so the new code can be introduced.
task("cleanDist", () => { return src("dist", {allowEmpty: true}).pipe(clean({force: true})) });




// Build CLI Series: Clean, Compile & Compress
exports.buildCLI = series("cleanDist", "compile", "compress");













/* DOCKER COMPOSE FILE (DCF) */




// Deletes the dist directory so the new code can be introduced.
task("cleanDockerComposeFile", () => { return src("./docker-compose.yml", {allowEmpty: true}).pipe(clean({force: true})) });




// Sets the appropiate docker-compose.yml file
task("defaultModeDockerComposeFile", () => { return setDockerComposeFile("development", "default-mode") });
task("defaultModeDockerComposeFileProd", () => { return setDockerComposeFile("production", "default-mode") });
task("debugModeDockerComposeFile", () => { return setDockerComposeFile("development", "debug-mode") });
task("debugModeDockerComposeFileProd", () => { return setDockerComposeFile("production", "debug-mode") });
task("restoreModeDockerComposeFile", () => { return setDockerComposeFile("development", "restore-mode") });
task("restoreModeDockerComposeFileProd", () => { return setDockerComposeFile("production", "restore-mode") });
task("testModeDockerComposeFile", () => { return setDockerComposeFile("development", "test-mode") });


// Docker Compose File Series: Clean and Place new file
exports.defaultModeDCF = series("cleanDockerComposeFile", "defaultModeDockerComposeFile");
exports.defaultModeDCFProd = series("cleanDockerComposeFile", "defaultModeDockerComposeFileProd");
exports.debugModeDCF = series("cleanDockerComposeFile", "debugModeDockerComposeFile");
exports.debugModeDCFProd = series("cleanDockerComposeFile", "debugModeDockerComposeFileProd");
exports.restoreModeDCF = series("cleanDockerComposeFile", "restoreModeDockerComposeFile");
exports.restoreModeDCFProd = series("cleanDockerComposeFile", "restoreModeDockerComposeFileProd");
exports.testModeDCF = series("cleanDockerComposeFile", "testModeDockerComposeFile");




/*
* Sets the correct docker-compose.yml at the root of the project in order to be used.
* @param environment "development"|"production"
* @param mode "default"|"debug-mode"|"test-mode"|"restore-mode"
* */
function setDockerComposeFile(environment, mode) { 
    return src("./docker-compose/" + environment + "/" + mode +"/docker-compose.yml").pipe(dest("./")) 
}