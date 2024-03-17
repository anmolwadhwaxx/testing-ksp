import React, {
    useState,
    useEffect
} from 'react';
import {
    useNavigate
} from 'react-router-dom';

const ForgotPasswordSuccessPopUp = ({
    email_id
}) => {
    const navigate = useNavigate();

    return ( <
        div className = "alertContainer" >
        <
        div className = "alertPopUp" >
        <
        div className = "alertPopUpContent" >
        <
        div className = "alerPopUpContentIcon" >
        <
        i className = "fa-regular fa-circle-check alerPopUpContentIco" > < /i> <
        /div> <
        div className = "alerPopUpContentHeadingDescription" >
        <
        div className = "alerPopUpContentHeading" >
        <
        p className = "alerPopUpContentHeadingTxt" > Password Sent To Your Email ID < /p> <
        /div> <
        div className = "alerPopUpContentDescription" >
        <
        p className = "alerPopUpContentDescriptionTxt" > We have sent a temporary password
        for {
            email_id
        }.Please use the same to Login to your profile.Wait
        for 10 - 15 mins
        if you haven 't received an Email Yet.</p> <
        /div> <
        /div> <
        /div> <
        div className = "alertPopUpActions" >
        <
        div className = "alertPopUpActionsMain" >
        <
        button className = "alertPopUpActionSingle"
        onClick = {
            () => navigate('/')
        } > okay < /button> { /* <button className="alertPopUpActionSingle">close</button> */ } <
        /div> <
        /div> <
        /div> <
        /div>
    )
}

export default ForgotPasswordSuccessPopUp