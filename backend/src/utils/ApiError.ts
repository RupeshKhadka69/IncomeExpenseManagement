
class ApiError extends Error {
    statuscode :number;
    data: any;
    success: boolean;
    errors: any[];
    constructor(
        statuscode:number,
        message="something went wrong",
        errors = [],
        stack= ""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
        if(stack){
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this,this.constructor);
        }

    }

}

export {ApiError};