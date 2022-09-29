en test-network

./network.sh deployCC -ccn kinto -ccp ../../../Kinto-storage-contract/ -ccl typescript
./network.sh deployCC -ccn fabcar -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript
cp -r ./organizations/peerOrganizations/org1.example.com/ /mnt/c/Users/override/Documents/code/Kinto-storage-service$/org1.example.com

./network.sh down 
./network.sh up createChannel -c mychannel -ca