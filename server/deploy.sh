#!/bin/bash
. ./.env
echo "Starting $IMAGE_NAME"
sudo docker build -t $IMAGE_NAME .
sudo docker 2>/dev/null stop $CONTAINER_NAME | true 
sudo docker 2>/dev/null rm $CONTAINER_NAME | true
sudo docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME 
sudo docker 2>/dev/null cp ./.env $CONTAINER_NAME:/app/server/.env | true
sudo docker 2>/dev/null cp ../client/build $CONTAINER_NAME:/app/client | true
echo ".env file copied to container $CONTAINER_NAME on port $PORT"
echo "Docker image $IMAGE_NAME is running on port $PORT"
echo "To stop the container, run: sudo docker stop $(sudo docker ps -q)"
echo "To remove the container, run: sudo docker rm $(sudo docker ps -q)"
echo "To remove the image, run: sudo docker rmi $(sudo docker images -q)"
echo "To remove all containers and images, run: sudo docker system prune -a"
echo "To see the logs, run: sudo docker logs -f $(sudo docker ps -q)"
echo "To see the container, run: sudo docker ps"
echo "To see the image, run: sudo docker images"
echo "To see the system, run: sudo docker system prune -a"
