class DBParser{
    static REDIS_MAGIC_STRING = 5;
    static RDB_VERSION =  4;
    static AUX = 0xfa;
    static SELECTDB = 0xfe;
    static RESIZEDB = 0xfb;

    buffer;
    counter;

    constructor(buffer){
        this.buffer = buffer;
        this.counter = 0;
    }

    printBuffer(){
        console.log(`Buffer : ${this.buffer}`);
        console.log(`Buffer.toString : ${this.buffer.toString()}`);
    }

    read(){
        let redisString = this.getString(DBParser.REDIS_MAGIC_STRING);
        this.counter += DBParser.REDIS_MAGIC_STRING;

        let rdbVersion = this.getString(DBParser.RDB_VERSION);
        this.counter += DBParser.RDB_VERSION;

        console.log(`Redis Magic String:`, redisString);
        console.log(`RDB Version:`, rdbVersion);
        while(true){
            if(this.buffer[this.counter] == DBParser.AUX){
                this.counter++;
                let {key, value} = this.handleAUX();
                console.log(`This is the AUX Key: ${key}`);
                console.log(`This is the AUX value: ${value}`);
            }
            else if(this.buffer[this.counter] == DBParser.SELECTDB){
                this.counter++;
                let dbNumber = this.buffer[this.counter];
                this.counter++;
                console.log(`DB Number : ${dbNumber}`)
            }
            else if(this.buffer[this.counter] == DBParser.RESIZEDB){
                this.counter++;
                let hashTableSize = this.handleStringEncoding();
                let expireTableSize = this.handleStringEncoding();
                console.log(`Hash Table size : ${hashTableSize}`);
                // console.log(`Expire Table size : ${expireTableSize}`)
            }
            else{
                let valueType = this.buffer[this.counter];
                console.log(valueType.toString(16));
                this.counter++;
        
                let stringEncodedKey = this.handleStringEncoding();
                console.log(stringEncodedKey);
                return stringEncodedKey;
            }

        }



    }
    
    handleAUX(){
        let key = this.handleStringEncoding();
        let value = this.handleStringEncoding();
        return {key, value};
    }
    
    handleStringEncoding(){
        let {type, value} = this.handleLengthEncoding();
        if(type < 3){
            let string = this.getString(value);
            this.counter += value;
            return string
        }else{
            // TODO:
            let res;
            switch(value){
                case 0:
                    res = this.buffer[this.counter];
                    this.counter++;
                    console.log("Case is 0");
                    break;
                case 1:
                    res = this.buffer.readUInt16LE(this.counter);
                    this.counter += 2;
                    console.log("Case is 1");
                    break;
                case 2:
                    res = this.buffer.readUInt32LE(this.counter);
                    this.counter += 4;
                    console.log("Case is 2");
                    break;
                case 3:
                    res = "Implement this";
            }
            return res.toString();
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
                objLength = ((this.buffer[this.counter] >> 2 ) << 8);
                this.counter++;
                objLength |= this.buffer[this.counter];
                this.counter++;
                break;
            case 2:
                this.counter++;
                objLength = this.buffer.readInt32LE(this.counter);
                this.counter += 4;
                break;
        }
    
        return {type: msb, value: objLength};
    }

    getString(len){
        return String.fromCharCode(...(this.buffer.subarray(this.counter, this.counter + len)));
    }
}

module.exports = DBParser;