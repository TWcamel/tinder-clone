root_dir:= pwd

all: client && server

dependencies: apt update -y\ 
	&& apt install -y yarn\
	&& apt install make -y

init: cd $(root_dir)./client\
	&& yarn install\
	&& cd $(root_dir)./server\
	&& yarn install

client: cd $(root_dir)/client\
	&& yarn build 

server: cd $(root_dir)/server\
	&& deploy.sh
