
// class ApiError extends Error {
//     statuscode :number;
//     data: any;
//     success: boolean;
//     message: string;
//     errors: string[];
//     constructor(
//         statuscode= 401,
//         message="something went wrong",
//         errors: string[] = [],
//         stack= ""
//     ){
//         super(message)
//         this.statuscode = statuscode
//         this.data = null
//         this.message = message
//         this.success = false;
//         this.errors = errors
//         if(stack){
//             this.stack = stack
//         }
//         else {
//             Error.captureStackTrace(this,this.constructor);
//         }

//     }

// }

// export {ApiError};
class ApiError {
  statuscode: number;
  message: string;
  data: [];

  constructor(statuscode: number, data: any, message = "failed") {
    this.statuscode = statuscode;
    this.message = message;
    this.data = data;
  }
}
export { ApiError };
