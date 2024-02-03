export default class DBParser{
    static REDIS_MAGIC_STRING =  5;
    static RDB_VERSION =  4;
    static AUX = 0xfa;
    
    buffer;
    counter;

    constructor(buffer){
        this.buffer = buffer;
        this.counter = 0;
    }

    
    read(){
        let redisString = this.buffer.slice(this.counter, this.counter + REDIS_MAGIC_STRING).toString('utf8');
        this.counter += REDIS_MAGIC_STRING;

        let rdbVersion = this.buffer.slice(this.counter, this.counter + RDB_VERSION).toString('utf8');
        this.counter += RDB_VERSION;

        console.log(`Redis Magic String: ${redisString}`);
        console.log(`RDB Version: ${rdbVersion}`);
        
        if(this.buffer[this.counter] == AUX){
            this.counter++;
            let {key, value} = this.handleAUX();
            console.log(`This is the AUX Key: ${key}`);
            console.log(`This is the AUX value: ${value}`);
        }
    }
    
    handleAUX(){
        let key = handleStringEncoding();
        let value = handleStringEncoding();
        return {key, value};
    }
    
    handleStringEncoding(){
        let {type, value} = handleLengthEncoding();
        if(type < 3){
            let string = String.fromCharCode(buffer.slice(this.counter, this.counter + value));
            this.counter += value;
            return string
        }else{
            // TODO:
        }
    }

    handleLengthEncoding(){
        const msb = ((this.buffer[this.counter]) & 0b11000000) >> 6;
        let objLength = 0;
        switch(msb){
            case 0:
            case 3: 
                objLength = (this.buffer[this.counter] & 0b00111111);
                this.counter++;
                break;
            case 1:
                objLength = ((this.buffer.readUInt8LE(this.counter) >> 2 ) << 8);
                this.counter++;
                objLength |= this.buffer.readUInt8LE(this.counter);
                this.counter++;
                break;
            case 2:
                this.counter++;
                objLength = buffer.readUInt32LE(this.counter);
                counter += 4;
                break;
        }
    
        return {type: msb, value: objLength};
    }
};

module.exports.DBParser = DBParser;