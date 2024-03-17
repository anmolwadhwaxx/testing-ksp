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
import ForgotPasswordSuccessPopUp from '../components/popups/ForgotPasswordSuccessPopUp';
import {
    API_BASE_URL,
    JWT_SECRET
} from '../config';
import {
    validateEmail,
    allowOnlyNumbers
} from '../utils/functions';
import {
    notifyError
} from '../utils/toastify';

const ForgotPassword = ({
    API_URL
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailID, setEmailID] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [kgid, setKgid] = useState('');
    const [isKgidError, setIsKgidError] = useState(false);
    const [kgidErrorMessage, setKgidErrorMessage] = useState('');

    const [showPasswordSentToEmailPopUp, setShowPasswordSentToEmailPopUp] = useState(false);

    const [ipAddress, setIpAddress] = useState('103');

    const [isLoading, setIsLoading] = useState(false);

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

    const handleChangeKgidHandler = (e) => {
        const isKgidValid = allowOnlyNumbers(e);

        if (isKgidValid) {
            setKgid(e);
            setIsKgidError(false);
            setKgidErrorMessage('');
        } else if (e.length === 0) {
            setKgid('');
            setIsKgidError(true);
            setKgidErrorMessage('KGID is Required');
        }
    }

    const forgotPasswordHandler = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setIsSubmitted(true);

        const data = {
            email_id: emailID,
            kgid: kgid
        }

        try {
            const forgotPasswordReq = await axios.post(`${API_URL}user/forgot-password`, data);
            if (forgotPasswordReq.status === 201) {
                setShowPasswordSentToEmailPopUp(true);
                setIsLoading(false);
                setIsSubmitted(true);
            } else {
                setShowPasswordSentToEmailPopUp(false);
                setIsLoading(false);
                setIsSubmitted(false);
            }
        } catch (error) {
            setIsSubmitted(false);
            setShowPasswordSentToEmailPopUp(false);
            if (error.response.status === 404) {
                notifyError('No User Found With The Given Email ID & KGID.');
            } else {
                notifyError('Something Went Wrong');
            }
            setIsLoading(false);
        }
    }

    return ( <
        >
        <
        form onSubmit = {
            (e) => forgotPasswordHandler(e)
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
        input type = "email"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Email ID"
        onChange = {
            (e) => handleEmailChange(e.target.value)
        }
        value = {
            emailID
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
        p className = "pageContentSectionFormStepHalfLableTxt" > KGID < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = "tel"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your KGID"
        value = {
            kgid
        }
        onChange = {
            (e) => handleChangeKgidHandler(e.target.value)
        }
        /> <
        /div> {
            isKgidError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    kgidErrorMessage
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
        div className = "pageContentSectionLoginDisclaimer hide" >
        &
        nbsp; <
        /div> <
        div className = "pageContentSectionConfirmButton" >
        <
        button type = "submit"
        className = "pageContentSectionConfirmButtonInput"
        disabled = {
            emailID == "" || kgid == "" || isEmailError || isKgidError || isLoading || isSubmitted
        } > Submit < /button> <
        /div> <
        /div> <
        /form>

        {
            showPasswordSentToEmailPopUp
                ?
                <
                ForgotPasswordSuccessPopUp email_id = {
                    emailID
                }
            />:
            <
            > < />
        } <
        />     
    )
}

export default ForgotPassword