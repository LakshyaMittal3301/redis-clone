const { dataType } = require('./datatypes');
const { createResponseObject } = require('./parser');
const fs = require('fs');
const path = require('path');

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

function readBinaryFile(filePath){
    
    try{
        const data = fs.readFileSync(filePath, 'binary');
        console.log(`Successfully read the data ${data}`);
        return data;
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
    }

}

function keys(config, arg){
    const filePath = path.join(config['dir'], config['dbfilename']);
    data = readBinaryFile(filePath);
    return createResponseObject(data, dataType.nullBulkString);
}

module.exports = {
    ping, 
    echo, 
    set,
    get,
    getConfig,
    keys
};