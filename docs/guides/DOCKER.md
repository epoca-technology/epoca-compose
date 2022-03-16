[< Back](../../README.md)

# DOCKER

## Installation

https://docs.docker.com/engine/install/ubuntu/


## Post Installation

https://docs.docker.com/engine/install/linux-postinstall/

#
# Docker Compose Installation:

https://docs.docker.com/compose/install/

## Permission Errors

Add User to Docker Group

`sudo usermod -aG docker $USER`

Add Docker Compose to the Docker Group

`sudo chgrp docker /usr/local/bin/docker-compose`

Allow Docker Group's Users to execute it

`sudo chmod 750 /usr/local/bin/docker-compose`