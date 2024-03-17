import axios from 'axios';
import React, {
    useState,
    useEffect
} from 'react';
import {
    useNavigate
} from 'react-router-dom';
import {
    API_BASE_URL
} from '../../config';
import {
    validatePassword
} from '../../utils/functions';
import {
    notifyError,
    notifySuccess
} from '../../utils/toastify';

const ChangePasswordPopUp = ({
    config,
    API_URL,
    user,
    hidePopUp,
    reportSuccess
}) => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [isCurrentPasswordError, setIsCurrentPasswordError] = useState(false);
    const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] = useState('');

    const [password, setPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [isPasswordMinCharValid, setIsPasswordMinCharValid] = useState(false);
    const [isPasswordUpperCaseValid, setIsPasswordUpperCaseValid] = useState(false);
    const [isPasswordLowerCaseValid, setIsPasswordLowerCaseValid] = useState(false);
    const [isPasswordDigitValid, setIsPasswordDigitValid] = useState(false);
    const [isPasswordSpecialCharValid, setIsPasswordSpecialCharValid] = useState(false);

    const [repeatPassword, setRepeatPassword] = useState('');
    const [isRepeatPasswordError, setIsRepeatPasswordError] = useState(false);
    const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const changeCurrentPasswordHandler = (e) => {
        setCurrentPassword(e);
        if (e.length != 0) {
            setIsCurrentPasswordError(false);
            setCurrentPasswordErrorMessage("");
        } else {
            setIsCurrentPasswordError(true);
            setCurrentPasswordErrorMessage("Current Password is Required");
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e);
        const isPasswordValid = validatePassword(e);
        if (isPasswordValid.status === false) {
            setIsPasswordLowerCaseValid(isPasswordValid.isLowerCaseValid);
            setIsPasswordUpperCaseValid(isPasswordValid.isUpperCaseValid);
            setIsPasswordDigitValid(isPasswordValid.isDigitValid);
            setIsPasswordSpecialCharValid(isPasswordValid.isSpecialCharValid);
            setIsPasswordMinCharValid(isPasswordValid.isMinCharValid);
        } else {
            setIsPasswordLowerCaseValid(true);
            setIsPasswordUpperCaseValid(true);
            setIsPasswordDigitValid(true);
            setIsPasswordSpecialCharValid(true);
            setIsPasswordMinCharValid(true);
        }
    }

    const changeRepeatPasswordHandler = (e) => {
        setRepeatPassword(e);
        if (e.length != 0) {
            setIsRepeatPasswordError(false);
            setRepeatPasswordErrorMessage("");
        } else {
            setIsRepeatPasswordError(true);
            setRepeatPasswordErrorMessage("Confirm Password is Required");
        }
    }

    const handleChangePasswordSubmit = async () => {

        if (password != repeatPassword) {
            return notifyError("New Password & Confirm Password doesn't Match");
        }

        setIsSubmitted(true);

        const data = {
            current_password: currentPassword,
            new_password: password
        }

        try {
            const changePasswordReq = await axios.patch(`${API_URL}user/change-password/${user.id}`, data, config);
            if (changePasswordReq.status === 200) {
                reportSuccess(true);
            } else {
                setIsSubmitted(false);
            }
        } catch (error) {
            setIsSubmitted(false);
            if (error.response.status === 401) {
                notifyError("Invalid Current Password. Check & Retry.");
            } else if (error.response.status === 400) {
                notifyError("Invalid Request.");
            } else {
                notifyError("Something Went Wrong.");
            }
        }
    }

    return ( <
        div className = "alertContainer" >
        <
        div className = "alertPopUp" >
        <
        div className = "alertPopUpChangePassword" >
        <
        div className = "alertPopUpChangePasswordHeading" >
        <
        p className = "alertPopUpChangePasswordHeadingTxt" > change password < /p> <
        /div>

        <
        div className = "alertPopUpChangePasswordContent" >
        <
        div className = "alertPopUpChangePasswordContentForm" >
        <
        div className = "alertPopUpChangePasswordStep" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > current password < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = {
            showCurrentPassword ? "text" : "password"
        }
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Enter Your Current Password"
        value = {
            currentPassword
        }
        onChange = {
            (e) => changeCurrentPasswordHandler(e.target.value)
        }
        /> <
        div className = "showPasswordIcon" > {
            showCurrentPassword ?
            <
            i className = "fa-solid fa-eye-slash showPasswordIco"
            onClick = {
                () => setShowCurrentPassword(false)
            } > < /i> :
                <
                i className = "fa-solid fa-eye showPasswordIco"
            onClick = {
                () => setShowCurrentPassword(true)
            } > < /i>
        } <
        /div> <
        /div> {
            isCurrentPasswordError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    currentPasswordErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> <
        div className = "alertPopUpChangePasswordStep" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > New Password < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = {
            showPassword ? "text" : "password"
        }
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Enter Your New Password"
        onChange = {
            (e) => handlePasswordChange(e.target.value)
        }
        value = {
            password
        }
        />

        <
        div className = "showPasswordIcon" > {
            showPassword ?
            <
            i className = "fa-solid fa-eye-slash showPasswordIco"
            onClick = {
                () => setShowPassword(false)
            } > < /i> :
                <
                i className = "fa-solid fa-eye showPasswordIco"
            onClick = {
                () => setShowPassword(true)
            } > < /i>
        } <
        /div> <
        /div>

        <
        div className = "pageContentSectionFormStepPasswordReqs" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingle" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingleIcon" > {
            isPasswordMinCharValid ?
            <
            i className = "fa-solid fa-check pageContentSectionFormStepPasswordReqSingleIco successIcon" > < /i> :
                <
                i className = "fa-solid fa-xmark pageContentSectionFormStepPasswordReqSingleIco errorIcon" > < /i>
        } <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingleLable" >
        <
        p className = "pageContentSectionFormStepPasswordReqSingleLableTxt" > 8 character minimum < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingle" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingleIcon" > {
            isPasswordDigitValid ?
            <
            i className = "fa-solid fa-check pageContentSectionFormStepPasswordReqSingleIco successIcon" > < /i> :
                <
                i className = "fa-solid fa-xmark pageContentSectionFormStepPasswordReqSingleIco errorIcon" > < /i>
        } <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingleLable" >
        <
        p className = "pageContentSectionFormStepPasswordReqSingleLableTxt" > Must contain one number < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingle" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingleIcon" > {
            isPasswordSpecialCharValid ?
            <
            i className = "fa-solid fa-check pageContentSectionFormStepPasswordReqSingleIco successIcon" > < /i> :
                <
                i className = "fa-solid fa-xmark pageContentSectionFormStepPasswordReqSingleIco errorIcon" > < /i>
        } <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingleLable" >
        <
        p className = "pageContentSectionFormStepPasswordReqSingleLableTxt" > Must contain one special character < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingle" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingleIcon" > {
            isPasswordUpperCaseValid ?
            <
            i className = "fa-solid fa-check pageContentSectionFormStepPasswordReqSingleIco successIcon" > < /i> :
                <
                i className = "fa-solid fa-xmark pageContentSectionFormStepPasswordReqSingleIco errorIcon" > < /i>
        } <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingleLable" >
        <
        p className = "pageContentSectionFormStepPasswordReqSingleLableTxt" > One upper
        case letter < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingle" >
        <
        div className = "pageContentSectionFormStepPasswordReqSingleIcon" > {
            isPasswordLowerCaseValid ?
            <
            i className = "fa-solid fa-check pageContentSectionFormStepPasswordReqSingleIco successIcon" > < /i> :
                <
                i className = "fa-solid fa-xmark pageContentSectionFormStepPasswordReqSingleIco errorIcon" > < /i>
        } <
        /div> <
        div className = "pageContentSectionFormStepPasswordReqSingleLable" >
        <
        p className = "pageContentSectionFormStepPasswordReqSingleLableTxt" > One lower
        case letter < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        div className = "alertPopUpChangePasswordStep" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > confirm password < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = {
            showRepeatPassword ? "text" : "password"
        }
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Confirm Your Password"
        value = {
            repeatPassword
        }
        onChange = {
            (e) => changeRepeatPasswordHandler(e.target.value)
        }
        /> <
        div className = "showPasswordIcon" > {
            showRepeatPassword ?
            <
            i className = "fa-solid fa-eye-slash showPasswordIco"
            onClick = {
                () => setShowRepeatPassword(false)
            } > < /i> :
                <
                i className = "fa-solid fa-eye showPasswordIco"
            onClick = {
                () => setShowRepeatPassword(true)
            } > < /i>
        } <
        /div> <
        /div> {
            isRepeatPasswordError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    repeatPasswordErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> <
        /div> <
        /div> <
        div className = "alertPopUpChangePasswordActions" >
        <
        div className = "alertPopUpActionsMain" >
        <
        button className = "alertPopUpActionSingle"
        disabled = {
            currentPassword == "" || password == "" || repeatPassword == "" || isCurrentPasswordError || isPasswordError || isRepeatPasswordError || isSubmitted
        }
        onClick = {
            () => handleChangePasswordSubmit()
        } > submit < /button> <
        button className = "alertPopUpActionSingle danger"
        onClick = {
            () => hidePopUp()
        } > close < /button> <
        /div> <
        /div> <
        /div> <
        /div> <
        /div>
    )
}

export default ChangePasswordPopUp