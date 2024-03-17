import React from 'react';
import {
    Navigate,
    useNavigate
} from 'react-router-dom';
import {
    useLocation
} from 'react-router-dom';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    logout
} from '../../reducers/user';

const PreLoginContent = ({
    pageHeading,
    actionContent,
    actionLable,
    actionLink,
    children
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/');
    }

    return ( <
        div className = "pageContent" >
        <
        div className = "pageContentDecorator" >
        <
        img src = "images/decorator-top-right.png"
        className = "pageContentDecoratorImg" / >
        <
        /div> <
        div className = "pageContentMain" >
        <
        div className = "pageContentHeadingAction" >
        <
        div className = "pageContentHeading" >
        <
        p className = "pageContentHeadingTxt" > {
            pageHeading
        } < /p> <
        /div> <
        div className = "pageContentLoginAction" >
        <
        p className = "pageContentActionTxt" > {
            actionContent
        } < /p> {
            location.pathname != '/dashboard' ?
                <
                p className = "pageContentLoginActionLink"
            onClick = {
                    () => navigate(actionLink)
                } > {
                    actionLable
                } < /p>:
                <
                >
                <
                p className = "pageContentLoginActionLink"
            onClick = {
                    () => navigate('/edit-profile')
                } > edit profile < /p> <
                p className = "pageContentLoginActionLink"
            onClick = {
                    () => logoutHandler()
                } > logout < /p> <
                />
        }

        <
        /div> <
        /div>

        {
            children
        } <
        /div> <
        /div>
    )
}

export default PreLoginContent