const { dataType } = require('./datatypes');
const { createResponseObject } = require('./parser');

function ping(){
    return createResponseObject('PONG', dataType.simpleString);
}

function echo(message){
    return createResponseObject(message, dataType.simpleString);
}

function set(dataStore, key, value, arg, argVal){
    let expiryTime = null;
    if(arg == "px"){
        let timeDelay = 1*argVal;
        expiryTime = new Date(Date.now() + timeDelay);
    }
    
    console.log(`Key : ${key}, value : ${value}, arg : ${arg}, argVal : ${argVal}`);
    console.log("expiry", expiryTime);
    dataStore.set(key, {value, expiryTime})
    
    return createResponseObject("OK", dataType.simpleString);
}

function get(dataStore, key){
    if(dataStore.has(key)){
        console.log('Key,', key);
        console.log('Cur date, ', Date.now());
        console.log('expiry Date of get Key', dataStore.get(key).expiryTime);
        if(dataStore.get(key).expiryTime !== null && dataStore.get(key).expiryTime < Date.now()){
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