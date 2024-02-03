const { dataType } = require('./datatypes');
const { createResponseObject } = require('./parser');

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

function keys(dataStore, arg){
    res = [...dataStore.keys()][0];
    return createResponseObject([createResponseObject(res, dataType.bulkString)], dataType.array);
}

module.exports = {
    ping, 
    echo, 
    set,
    get,
    getConfig,
    keys
};