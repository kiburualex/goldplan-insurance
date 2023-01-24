class Helpers{

    static generateRandom = (length=6) =>{
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static formatTime(time){
        return new Date(time).toISOString().slice(0, 19).replace('T', ' ');
    }
    
    static renderTimestamp = (timestamp) => {
        let prefix = "";
        const timeDiff = Math.round(
            (new Date().getTime() - new Date(timestamp).getTime()) / 60000
        );
        if (timeDiff < 1) {
            // less than one minute ago
            prefix = "just now...";
        } else if (timeDiff < 60 && timeDiff > 1) {
            // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24 * 60 && timeDiff > 60) {
            // less than 24 hours ago
            prefix = `${Math.round(timeDiff / 60)} hours ago`;
        } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
            // less than 7 days ago
            prefix = `${Math.round(timeDiff / (60 * 24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix;
    };

    static isObjectEmpty = (obj) => {
        for(const key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static handlerException = (error, navigation) =>{
        /*  error: { response: {data: "", status: "", headers:""}} */
        if (error.response) {
            // Request made and server responded
            if(error.response.status === 401){
                Helpers.logout(navigation)
            }
        } else if (error.request) {
            // The request was made but no response was received
            alert(error.request)
        } else {
            // Something happened in setting up the request that triggered an Error
            alert(error.message)
        }
    }

    static toDataURL = (url, callback) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () =>{
            const reader = new FileReader();
          reader.onloadend = () =>{
            callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
}


export default Helpers;