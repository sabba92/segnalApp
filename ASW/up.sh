 docker network create -d bridge interna
 docker run  -itd  --network interna  -p 27017-27019:27017-27019  --name mongodb  mymongo
 docker run -itd --rm --network interna --name nodejsapp -p 3000:3000 nodejsapp
