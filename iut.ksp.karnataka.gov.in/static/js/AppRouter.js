import React, {
    useEffect,
    useState
} from 'react';
import {
    useSelector
} from 'react-redux';
import verifyToken from './verify-jwt';
import {
    Navigate,
    Route,
    Routes
} from 'react-router-dom';
import {
    ROLES,
    LOGGER
} from './config';

import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import PreLoginOutlet from './pages/PreLoginOutlet';
import Registration from './pages/Registration';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminOutlet from './pages/AdminOutlet';
import EditEmployeeProfile from './pages/EditEmployeeProfile';

const AppRouter = ({
        API_BASE_URL
    }) => {

        const [auth, setAuth] = useState(null);

        const user = useSelector((state) => state.user.value);

        const isAdmin = ROLES.ADMIN === user.role;
        const isEmployee = ROLES.EMPLOYEE === user.role;

        useEffect(() => {
            async function checkIsLoggedIn() {
                if (user.is_logged_in === true) {
                    const checkToken = await verifyToken(user.access_token);
                    setAuth(checkToken.status);
                } else {
                    setAuth(false);
                }
            }
            checkIsLoggedIn();
        }, [user]);

        return ( <
                > {
                    auth != null ?
                    <
                    Routes > {!auth && ( <
                            Route path = "/"
                            element = { < PreLoginOutlet / >
                            } >
                            <
                            Route index element = { < Login API_URL = {
                                    API_BASE_URL
                                }
                                />} / >
                                <
                                Route path = "registration"
                                element = { < Registration API_URL = {
                                        API_BASE_URL
                                    }
                                    />} / >
                                    <
                                    Route path = "forgot-password"
                                    element = { < ForgotPassword API_URL = {
                                            API_BASE_URL
                                        }
                                        />} / >
                                        <
                                        /Route>
                                    )
                                } {
                                    auth && ( <
                                            >
                                            <
                                            Route path = "/"
                                            element = { < Navigate to = {
                                                    "/dashboard"
                                                }
                                                />} / >
                                                <
                                                Route path = "/dashboard"
                                                element = {
                                                    user.role == "EMPLOYEE" ? < PreLoginOutlet / > : < AdminOutlet / >
                                                } >
                                                <
                                                Route index element = {
                                                    user.role == "EMPLOYEE" ? < EmployeeDashboard API_URL = {
                                                        API_BASE_URL
                                                    }
                                                    /> : <AdminDashboard API_URL={API_BASE_URL} / >
                                                }
                                                /> <
                                                /Route> <
                                                Route path = "/edit-profile"
                                                element = {
                                                    user.role == "EMPLOYEE" ? < PreLoginOutlet / > : < AdminOutlet / >
                                                } >
                                                <
                                                Route index element = {
                                                    user.role == "EMPLOYEE" ? < EditEmployeeProfile API_URL = {
                                                        API_BASE_URL
                                                    }
                                                    /> : <AdminDashboard API_URL={API_BASE_URL} / >
                                                }
                                                /> <
                                                /Route> <
                                                />
                                            )
                                        } <
                                        Route path = "*"
                                    element = { < Navigate to = {
                                                auth ? "/dashboard" : "/"
                                            }
                                            />} / >
                                            <
                                            /Routes>:
                                                <
                                                > < />
                                        } <
                                        />

                                )
                            }

                            export default AppRouter;