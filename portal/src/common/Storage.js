class Storage {
    static storeData = (key, value) => {
        try {
            localStorage.setItem(key, value)
        } catch (e) {
            console.log("error storing key ", key)
        }
    }

    // store objects
    static storeObject = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.log("error storing key ", JSON.stringify(key))
        }
    }


    static getData = (key) => {
        try {
            return localStorage.getItem(key)
        } catch(e) {
            console.log("error feching key ", key)
            return null;
        }
    }

    // get object
    static getObject = (key) => {
        try {
            const retrievedItem =  localStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch(e) {
            console.log("error feching key ", key)
            return null;
        }
    }

    static removeData = (key) => {
        try {
            localStorage.removeItem(key)
        } catch(e) {
            console.log("error removing key ", key)
        }
    }  
    
    static clear = () => {
        try {
            localStorage.clear();
        } catch(e) {
            console.log("error clearing storage")
        }
        console.log('Storage Cleared.')
    }
}

export default Storage;