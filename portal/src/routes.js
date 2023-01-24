import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Users from './pages/user/Users';
import UserForm from './pages/user/UserForm';
import Insurances from './pages/insurance/Insurances';
import InsuranceForm from './pages/insurance/InsuranceForm';
import NotFound from './pages/Page404';
import ForgotPassword from './pages/ForgotPassword';
// ----------------------------------------------------------------------

export default function Router() {
    // refine token to match with something also
//    const isLoggedIn = localStorage.getItem('token') !== null;
    const isLoggedIn = true;
    return useRoutes([
        {
            path: '/dashboard',
            element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
            children: [
                { element: <Navigate to="/dashboard" replace /> },
                { path: '', element: <DashboardApp /> },
            ]
        },
        {
            path: '/users',
            element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
            children: [
                { element: <Navigate to="/users/list" replace /> },
                { path: '', element: <Users /> },
                { path: 'list', element: <Users /> },
                { path: ':id', element: <UserForm /> },
                { path: 'new', element: <UserForm /> }
            ]
        },
        {
            path: '/insurances',
            element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
            children: [
                { element: <Navigate to="/insurances" replace /> },
                { path: '', element: <Insurances /> },
                { path: ':id', element: <InsuranceForm /> },
                { path: 'new', element: <InsuranceForm /> }
            ]
        },
        
        {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
                { path: 'login', element: !isLoggedIn ? <Login /> : <Navigate to="/dashboard" /> },
                { path: 'forgotpassword', element: !isLoggedIn ? <ForgotPassword /> : <Navigate to="/dashboard" /> },
                { path: 'register', element: !isLoggedIn ? <Register /> : <Navigate to="/dashboard" /> },
                { path: '404', element: <NotFound /> },
                { path: '/', element: <Navigate to="/dashboard" /> },
                { path: 'users', element: <Navigate to="/users" /> },
                { path: 'insurances', element: <Navigate to="/insurances" /> },
                { path: '*', element: <Navigate to="/404" /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
