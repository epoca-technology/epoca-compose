# EPOCA COMPOSE

Epoca Compose is a CLI designed to perform sensitive operations and can run without an active Internet connection. It also takes care of managing the project's containers by making use of Docker Compose.


## Docs

- [Docker](./docs/guides/DOCKER.md)



## Requirements

- Docker: 20.10.20

- Docker Compose: v1.29.2

- NodeJS: v16.14.0

- NPM: v8.3.1

- Install dependencies with `npm install` 

- The `.env` file must be placed in the root directory

```
compose
    │
    .env
```




#
# Docker Compose File

The `docker-compose.yml` is generated from the `./docker-compose` directory based on the mode containers are running in. Changes need to be applied to the files within the `./docker-compose` directory as the `docker-compose.yml` located in root is replaced when scripts are executed.

```
compose
    │
    docker-compose/
    │    ├───development/
    │    │       ├───default-mode/
    │    │       ├───restore-mode/
    │    │       └───test-mode/
    │    └───production/
    │            ├───default-mode/
    │            └───restore-mode/
    │
    docker-compose.yml <- Automatically generated
```




#
# Containers Management

Start Containers:

`npm run up` | `npm run up-prod`

Stop Containers:

`npm run down`

Restarts all the running containers without rebuilding the images:

`npm run restart`

Build & Start Containers:

`npm run build` | `npm run build-prod`

Build & Start Containers in Restore Mode:

`npm run restore-mode` | `npm run restore-mode-prod`

Build & Start Containers in Test Mode:

`npm run test-mode`

Removes the dangling containers and images:

**IMPORTANT:** This functionality must be used only when the containers are running. As a precaution, backup the database before performing this action.

`npm run prune`





#
# Database Management

## Database Backup

Dumps, compresses and uploads the Database to Firebase Storage. Once uploaded, it cleans up the volume:

`npm run database-backup`

## Database Restore

Downloads and restores a given database backup. Once restored, it cleans up the volume:

*IMPORTANT: The containers must be running on **restore mode**.* 

`npm run database-restore`





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
compose
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






#
# Containerized Unit Tests

In order to be able to execute these tests, you must initialize the containers with `npm run test-mode`.

## Core API

**End-to-end:** `npm run test-core`

**API Error:** `npm run test-core-api-error`

**Auth:** `npm run test-core-auth`

**Candlestick:** `npm run test-core-candlestick`

**Database:** `npm run test-core-db`

**GUI Version:** `npm run test-core-gui-version`

**IP Blacklist:** `npm run test-core-ip-blacklist`

**Notification:** `npm run test-core-notification`

**Server:** `npm run test-core-server`

**Utilities:** `npm run test-core-utils`