export interface IEnvironment {
    generateEnvironment(): string,
}






// Output File Paths
export interface IOutputPaths {
    source: string,
    info: string,
    index: string,
    container: string,
    linux: string,
    windows: string,
}



// Environment Object
export interface IEnvironmentObject { [key: string]: any }



// Output Files
export interface IOutputFiles {
    info: string,
    index: string,
    container: string,
    linux: string,
    windows: string
}