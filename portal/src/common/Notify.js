import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Notify {
     /*
    * React-tTastify
    * Import: import { ToastContainer, toast } from 'react-toastify';
    * Css: import 'react-toastify/dist/ReactToastify.css';
    * Usage: (import and Call the <ToastContainer /> at the main parent component
    *         or in the calling component e.g)
    *   class App extends React.Component{
    *       render(){
    *           return (
    *               <div>
    *                   <SampleComponent>
    *                   <ToastContainer />
    *               </div>
    *           );
    *       }
    *   }
    *  Using Notify.js
    *   import Notify from '../constants/Alert';
    *
    *   handleNotify = () => {
    *       Notify.success('my message');
    *   }
    *
    */
    static notificationTheme(message, theme) {
        return toast(message, {
            type: theme,
            position: toast.POSITION.TOP_RIGHT,
            autoClose: true,
            hideProgressBar: true
        });
    }
    static success(message = 'nothing set') {
        this.notificationTheme(message, 'success');
    }
    static error(message = 'nothing set') {
        this.notificationTheme(message, 'error');
    }
    static info(message = 'nothing set') {
        this.notificationTheme(message, 'info');
    }
    static warning(message = 'nothing set') {
        this.notificationTheme(message, 'warning');
    }
}

export default Notify;
