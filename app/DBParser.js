class DBParser{
    static REDIS_MAGIC_STRING =  5;
    static RDB_VERSION =  4;
    static AUX = 0xfa;
    
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
        let string = "";

        for(let i=0; i < 6; i++){
            string += String.fromCharCode(this.buffer[this.counter + i]);
        }

        console.log("Inside class: ", string);
        let redisString = this.getString(this.REDIS_MAGIC_STRING);
        this.counter += this.REDIS_MAGIC_STRING;

        let rdbVersion = this.getString(this.RDB_VERSION);
        this.counter += this.RDB_VERSION;

        console.log(`Redis Magic String: ${redisString}`);
        console.log(`RDB Version: ${rdbVersion}`);
        
        // if(this.buffer[this.counter] == this.AUX){
        //     this.counter++;
        //     let {key, value} = this.handleAUX();
        //     console.log(`This is the AUX Key: ${key}`);
        //     console.log(`This is the AUX value: ${value}`);
        // }
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
                objLength = this.buffer.readUInt32LE(this.counter);
                this.counter += 4;
                break;
        }
    
        return {type: msb, value: objLength};
    }

    getString(len){
        let string = "";

        for(let i=0; i < len; i++){
            string += String.fromCharCode(this.buffer[this.counter + i]);
        }
        return string;
    }
}

module.exports = DBParser;