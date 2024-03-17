import React from 'react';
import {
    Outlet
} from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';

const AdminOutlet = () => {
    return ( <
        >
        <
        AdminLayout >
        <
        Outlet / >
        <
        /AdminLayout> <
        />
    );
};

export default AdminOutlet;