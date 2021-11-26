export IP=$(ipconfig getifaddr en0)
COMPOSE_HTTP_TIMEOUT=200 docker-compose up
# --build  Build images before starting containers
# --detach Detached mode: Run containers in the background
