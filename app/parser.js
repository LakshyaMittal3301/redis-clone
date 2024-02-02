const { dataType } = require('./datatypes');

function createResponseObject(value, type){
    return {value, type};
}

function parseResponse(res){
    let {value, type} = res;
    let ret;
    switch(type){
        case dataType.simpleString:
            ret = parseSimpleString(value);
            break;
        case dataType.nullBulkString:
            ret = parseNullBulkString(value);
            break;
        case dataType.bulkString:
            ret = parseBulkString(value);
            break;
        case dataType.array:
            ret = parseArray(value);
        break;

    }
    return ret;
}

function parseSimpleString(string){
    return `+${string}\r\n`;
}

function parseNullBulkString(string){
    return '$-1\r\n';
}

function parseBulkString(string){
    return `$${string.length}\r\n${string}\r\n`;
}

function parseArray(array){
    ret = `*${array.length}\r\n`;
    for(const element of array){
        ret += parseResponse(element);
    }
    return ret;
}

module.exports.parseResponse = parseResponse;
module.exports.createResponseObject = createResponseObject;