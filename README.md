# PLUTUS COMPOSE

Plutus Compose is a CLI designed to perform sensitive operations and can run without an active Internet connection. It also takes care of managing the project's containers by making use of Docker Compose.


## Requirements

- Docker: 20.10.12

- Docker Compose: v1.29.2

- NodeJS: v16.13.1

- NPM: v8.1.2

- Install dependencies with `npm install` 


#
# Containers Management

Start Containers:

`docker-compose up -d`

Build & Start Containers:

`docker-compose up --build -d`

Start Containers in Test Mode:

`testMode=true docker-compose up --build -d`


Start Containers in Debug Mode:

`debugMode=true docker-compose up --build -d`




#
# General Helpers

## Generate Password

Generates a secure password based on provided parameters.

`npm run generate-password`

#
## Generate God Skeleton

Generates a build of the God's User Skeleton that should be placed in the environment file for the Core API to initialize.

`npm run generate-god-skeleton`

#
## Generate Environment

Generates a series of environment files in different formats for different Operating Systems that are used to initialize the environment variables required by the APIs to function.

Before running the script, make sure you have filled the `./environment/source.json` file with the desired values.

`npm run generate-environment`

After the script is executed, it will clear the values from the `environment/source.json` file and place the following files inside of the `/environment/output` directory:

```
security
    │
    environment
    │
    └───source.json
    │
    └───output 
        ├── source.json
        ├── info.txt
        ├── index.txt
        ├── container.env
        ├── linux.txt
        └── windows.txt
```

1) **source.json**: Copy of the source.json that was used to generate the environment.

2) **info.txt**: General info about the generated environment.

3) **index.txt**: Environment Variables placed in key/value format.

5) **container.env**: Environment Variables for Docker Containers.

6) **linux.txt**: Environment Variables for Linux Distributions.

7) **windows.txt**: Environment Variables for Windows Distributions.

**IMPORTANT:** Once the files have been placed in an encrypted container, make sure to remove all the readable copies stored in the machine (Including the Trash). You can also achieve this by simply running the script again as it will replace all the output files with the default source.json file.