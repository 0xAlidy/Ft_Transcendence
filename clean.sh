docker rm -f $(docker ps -aq)
docker image rm -f $(docker image ls -aq)
docker system prune -a
