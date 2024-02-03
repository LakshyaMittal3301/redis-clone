const { dataType } = require('./datatypes');
const { createResponseObject } = require('./parser');

function ping(){
    return createResponseObject('PONG', dataType.simpleString);
}

function echo(message){
    return createResponseObject(message, dataType.simpleString);
}

function set(dataStore, key, value, arg, argVal){
    let timeDelay = arg == "px" ? argVal : null;
    
    let curDate = new Date();
    let expiryDate = arg == "px" ? new Date(curDate + timeDelay) : null;

    dataStore.set(key, {value, expiryDate})
    
    return createResponseObject("OK", dataType.simpleString);
}

function get(dataStore, key){
    let curDate = new Date();
    if(dataStore.has(key)){
        if(dataStore.get(key).expiryDate < curDate){
            dataStore.delete(key);
            return createResponseObject("", dataType.nullBulkString);
        }
        return createResponseObject(dataStore.get(key).value, dataType.simpleString);
    }else{
        return createResponseObject("", dataType.nullBulkString);
    }
}

function getConfig(config, arg){
    let arr = [createResponseObject(arg, dataType.bulkString), createResponseObject(config[arg], dataType.bulkString)];
    return createResponseObject(arr, dataType.array);
}

function keys(dataStore, arg){
    let allKeys = [...dataStore.keys()];
    let res = [];
    for(const key of allKeys){
        res.push(createResponseObject(key, dataType.bulkString));
    }
    return createResponseObject(res, dataType.array);
}

module.exports = {
    ping, 
    echo, 
    set,
    get,
    getConfig,
    keys
};