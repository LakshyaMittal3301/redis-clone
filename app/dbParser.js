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

    const redisString = binaryData.slice(0, 5).toString();
    console.log(redisString);
    
}

module.exports = {
    dbParser
}