const fs = require('fs');
const REDIS_MAGIC_STRING =  5;
const RDB_VERSION =  4;

function dbParser(filePath){
    let binaryData = "";
    try{
        binaryData = fs.readFileSync(filePath);
        console.log(`Successfully read the data`);
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
        return null;
    }
    let counter = 0;
    let redisString = "";
    for(let i = 0; i < REDIS_MAGIC_STRING; i++){
        redisString += binaryData[counter++].toString();
    }
    console.log(redisString);
    
}

module.exports = {
    dbParser
}