const fs = require('fs');
const REDIS_MAGIC_STRING =  5;
const RDB_VERSION =  4;

function dbParser(filePath){
    let buffer = "";
    try{
        buffer = fs.readFileSync(filePath);
        console.log(`Successfully read the data`);
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
        return null;
    }
    console.log("buffer is : ");
    console.log(buffer.toString("hex").match(/../g).join(" "));

    let redisString = "";
    for(let i=0; i < REDIS_MAGIC_STRING; i++){
        redisString += String.fromCharCode(buffer[i]);
    }
    console.log(redisString);
    
}

module.exports = {
    dbParser
}