import React, {
    useEffect,
    useState
} from 'react';
import {
    BRAND_NAME
} from '../../config';
import AdminSidebar from './AdminSidebar';
import PreLoginContent from './PreLoginContent';
import {
    useLocation
} from 'react-router-dom';
import {
    ToastContainer
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    useDispatch,
    useSelector
} from 'react-redux';

import {
    useNavigate
} from 'react-router-dom';
import AdminContent from './AdminContent';
import RequestDetailsPopUp from '../popups/RequestDetailsPopUp';

const AdminLayout = ({
    children
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.value);

    const location = useLocation();

    return ( <
        >
        <
        div className = "page" > { /* <AdminSidebar /> */ } <
        AdminContent pageHeading = {
            location.pathname === '/' ? 'login' : location.pathname === '/registration' ? 'register' : location.pathname === '/forgot-password' ? 'forgot password' : location.pathname === '/dashboard' ? `Welcome ${user.name}!` :
                <
                > < />
        }
        actionContent = {
            location.pathname === '/' ? `haven't yet registered?` : location.pathname === '/registration' ? 'already have an account?' : location.pathname === '/forgot-password' ? 'back to login' :
                <
                > < />
        }
        actionLable = {
            location.pathname === '/' ? `register now` : location.pathname === '/registration' ? 'login' : location.pathname === '/forgot-password' ? 'login' : location.pathname === '/dashboard' ? 'logout' :
                <
                > < />
        }
        actionLink = {
            location.pathname === '/' ? `registration` : location.pathname === '/registration' ? '/' : location.pathname === '/forgot-password' ? '/logout' :
                <
                > < />
        } >
        {
            children
        } <
        /AdminContent> <
        /div> <
        ToastContainer style = {
            {
                zIndex: "99999 !important"
            }
        }
        /> <
        />
    );
};

export default AdminLayout;