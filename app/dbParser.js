const fs = require('fs');
const REDIS_MAGIC_STRING =  5;
const RDB_VERSION =  4;

function dbParser(filePath){
    let data = "";
    try{
        data = fs.readFileSync(filePath);
        console.log(`Successfully read the data ${data}`);
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
        return null;
    }
    let cursor = 0;
    let redisString = "";
    let rdbVersion = "";
    for(let i = 0; i < REDIS_MAGIC_STRING; i++){
        redisString += data[cursor++].toString();
    }
    for(let i = 0; i < RDB_VERSION; i++){
        rdbVersion += data[cursor++].toString;
    }

    console.log(`redis String is: ${redisString}`);
    console.log(`RDB Version is: ${rdbVersion}`);

    
}

module.exports = {
    dbParser
}