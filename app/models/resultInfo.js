module.exports = class ResultInfos {
        #queryStatus;
        #statusCode;
        #text;
        #data;    
    
        constructor(queryStatus, statusCode, text ,data){
            this.#queryStatus = queryStatus;
            this.#statusCode = statusCode;
            this.#text = text;
            this.#data = data;
        };

        getInfos(){
            return {queryStatus: this.#queryStatus, statusCode: this.#statusCode, text: this.#text, data: this.#data};
        };
            
};