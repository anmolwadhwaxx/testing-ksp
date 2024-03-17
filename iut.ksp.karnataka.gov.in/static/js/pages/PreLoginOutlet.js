import React from 'react';
import {
    Outlet
} from 'react-router-dom';
import PreLoginLayout from '../components/layouts/PreLoginLayout';

const PreLoginOutlet = () => {
    return ( <
        >
        <
        PreLoginLayout >
        <
        Outlet / >
        <
        /PreLoginLayout> <
        />
    );
};

export default PreLoginOutlet;