import axios from 'axios';
import React, {
    useState,
    useEffect
} from 'react';
import {
    decodeToken
} from 'react-jwt';
import {
    useDispatch
} from 'react-redux';
import {
    useNavigate,
} from 'react-router-dom';
import {
    API_BASE_URL,
    JWT_SECRET
} from '../config';
import {
    login
} from '../reducers/user';
import {
    validateEmail,
    validatePassword
} from '../utils/functions';
import {
    notifyError
} from '../utils/toastify';

const Login = ({
    API_URL
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailID, setEmailID] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [password, setPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [ipAddress, setIpAddress] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const getUserIpAddress = async () => {
        try {
            const getIpReq = await axios.get(`https://geolocation-db.com/json/`);
            setIpAddress(getIpReq.data.IPv4);
        } catch (error) {}
    }

    useEffect(() => {
        getUserIpAddress();
    }, []);

    const handleEmailChange = (e) => {
        setEmailID(e)

        let isEmailValid = validateEmail(e);

        setIsEmailError(!isEmailValid);

        if (e.length > 0) {
            setEmailErrorMessage('Invalid Email ID');
        } else {
            setEmailErrorMessage('Email ID is Required');
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e)

        if (e.length > 0) {
            setIsPasswordError(false);
            setEmailErrorMessage('');
        } else {
            setIsPasswordError(true);
            setPasswordErrorMessage('Password is Required');
        }
    }

    const loginUserHandler = async (e) => {
        e.preventDefault();

        setIsSubmitted(true);

        if (emailID === "") {
            setIsEmailError(true);
            setEmailErrorMessage("Email ID is Required");
            setIsSubmitted(false);
            return
        } else {
            setIsEmailError(false);
            setEmailErrorMessage("");
        }

        if (password === "") {
            setIsPasswordError(true);
            setPasswordErrorMessage("Password is Required");
            setIsSubmitted(false);
            return
        } else {
            setIsPasswordError(false);
            setPasswordErrorMessage("");
        }

        const data = {
            email_id: emailID,
            password: password,
            ip_address: ipAddress
        }

        try {
            const loginUserReq = await axios.post(`${API_URL}user/login`, data);
            if (loginUserReq.status === 200) {
                const data = loginUserReq.data;
                const {
                    role
                } = decodeToken(data.access_token, JWT_SECRET);
                if (role === 'ADMIN' || role === 'EMPLOYEE') {
                    dispatch(login({
                        id: data.user_id,
                        name: data.name,
                        role: role,
                        email_id: data.email_id,
                        joining_date: data.joining_date,
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
                        profile_pic: data ? .profile_pic,
                        is_logged_in: true
                    }));
                    navigate('/dashboard');
                } else {
                    // setRoleVerified(false);
                    setIsSubmitted(false);
                }
            } else {
                notifyError('Failed Logging In');
                setIsSubmitted(false);
            }
        } catch (error) {
            setIsSubmitted(false);
            if (error.response.status === 401) {
                notifyError('Email ID / Password Invalid');
            } else if (error.response.status === 404) {
                notifyError('Unable to Find The User With The Given Email ID');
            } else {
                notifyError('Something Went Wrong');
            }
        }
    }

    return ( <
        >
        <
        form onSubmit = {
            (e) => loginUserHandler(e)
        } >
        <
        div className = "pageContentSection registerSection" >
        <
        div className = "pageContentSectionForm loginForm" >
        <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > email ID < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = "text"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Email ID"
        onChange = {
            (e) => handleEmailChange(e.target.value)
        }
        /> <
        /div> {
            isEmailError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    emailErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > password < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = {
            showPassword ? "text" : "password"
        }
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Password"
        onChange = {
            (e) => handlePasswordChange(e.target.value)
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
        /div> {
            isPasswordError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    passwordErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> <
        /div> <
        /div> <
        /div>


        <
        div className = "pageContentSection sectionConfirm" >
        <
        div className = "pageContentSectionLoginDisclaimer" >
        <
        p onClick = {
            () => navigate('/forgot-password')
        }
        className = "pageContentSectionLoginForgotPasswordButton" > forgot password ? < /p> <
        /div> <
        div className = "pageContentSectionConfirmButton" >
        <
        button className = "pageContentSectionConfirmButtonInput"
        type = {
            'submit'
        }
        disabled = {
            isEmailError || isPasswordError || emailID == '' || password == '' || isSubmitted
        } > Submit < /button> <
        /div> <
        /div> <
        /form> <
        />     
    )
}

export default Login