

const uniqueMessage =  error =>{
    let output;
    try{
        let fieldName = error.message.substring(
            error.message.lastIndeOf(".$") +2,error.message.lastIndexof("_1"));

            return output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + "already exists";
    } catch(ex){
        return output = "Unique field already exists";
    }
}

exports.errorHandler = error =>{
    let message = "";
    if(error.code){
            switch(error.code){

                case 11000:
                case 11001:
                    message = uniqueMessage(error);
                    break;
                default:
                    message = "Something went wrong";
                     break;
            }
    } else{
        for(let errorName in error.errors){
            if(error.errors[errorName].message){
                message = error.errors[errorName].message;
            }
        }
    }
    return message;
}