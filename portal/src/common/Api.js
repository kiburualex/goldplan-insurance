import axios from 'axios';

class Api {
    static config(){
        return {         
            headers: { 
                'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
    }

    static multipartConfig(){
        return {         
            headers: {
                'Content-Type': 'multipart/form-data' ,
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };
    }

    static get(url) {
        const config = this.config();
        return axios.get(url, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static update(url, data) {
        const config = this.config();
        return axios.put(url, data, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static updateWithMulipart(url, data) {
        const config = this.multipartConfig();
        return axios.put(url, data, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static create(url, data) {
        const config = this.config();
        return axios.post(url, data, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static createWithMulipart(url, data) {
        const config = this.multipartConfig();
        return axios.post(url, data, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static delete(url){
        const config = this.config();
        return axios.delete(url, config)
            .then(response => response)
            .catch(error => {
                if(error.response.status === 401){
                    localStorage.clear();
                    window.location.href = "/login";
                }
                throw error;
            });
    }

    static request(methd, url, data={}){
        const method = methd.toLowerCase();
        if(method === "put"){
            return this.update(url, data);
        }
        return this.create(url, data);
    }

    static request(methd, url, data={}, applyMultipartConfig){
        const method = methd.toLowerCase();
        if(method === "put"){
            if(applyMultipartConfig === true){
                return this.updateWithMulipart(url, data);
            }
            return this.update(url, data);
        }
        if(applyMultipartConfig === true){
            return this.createWithMulipart(url, data);
        }
        return this.create(url, data);
    }

    static getErrorMessage(error){
        let response = "Error Fetching Data";
        if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             * console.log(error.response.data);
             * console.log(error.response.status);
             * console.log(error.response.headers);
            */
            if(error.response.status === 403 || error.response.status === 401){
                response = "token_expired";
            }else{

                response = error.response.data.message;
            }
        } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            
            response = "No Response from Server";
        } else {
            // Something happened in setting up the request and triggered an Error
            response = error.message;
        }

        return response;
    }
}

export default Api;
