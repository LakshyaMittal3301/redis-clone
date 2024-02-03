const { dataType } = require('./datatypes');
const { createResponseObject } = require('./parser');
const path = require('path');
const {DBParser} = require('./DBParser');

function ping(){
    return createResponseObject('PONG', dataType.simpleString);
}

function echo(message){
    return createResponseObject(message, dataType.simpleString);
}

function set(dataStore, key, value, arg, argVal){
    
    dataStore.set(key, value)
    
    if(arg == "px"){
        setTimeout(() => {
            dataStore.delete(key);
        }, argVal);
    }
    return createResponseObject("OK", dataType.simpleString);
}

function get(dataStore, key){
    if(dataStore.has(key)){
        return createResponseObject(dataStore.get(key), dataType.simpleString);
    }else{
        return createResponseObject("", dataType.nullBulkString);
    }
}

function getConfig(config, arg){
    let arr = [createResponseObject(arg, dataType.bulkString), createResponseObject(config[arg], dataType.bulkString)];
    return createResponseObject(arr, dataType.array);
}

function keys(config, arg){
    const filePath = path.join(config['dir'], config['dbfilename']);
    
    let buffer = "";
    try{
        buffer = fs.readFileSync(filePath);
        console.log(`Successfully read the data`);
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
        return null;
    }

    let dbParser = new DBParser(buffer);
    dbParser.read()
    return createResponseObject("", dataType.nullBulkString);
}

module.exports = {
    ping, 
    echo, 
    set,
    get,
    getConfig,
    keys
};