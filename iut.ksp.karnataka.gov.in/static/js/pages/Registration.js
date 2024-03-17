import React, {
    useState,
    useEffect,
    forwardRef
} from 'react';
import axios from 'axios';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
    allowOnlyNumbers,
    disableSpecialCharacter,
    validateEmail,
    validateAadhaarNumber,
    validatePhoneNumber,
    validatePassword
} from '../utils/functions';
import {
    API_BASE_URL
} from '../config';
import {
    notifyError
} from '../utils/toastify';
import {
    useNavigate
} from 'react-router-dom';

const Registration = ({
    API_URL
}) => {
    const navigate = useNavigate();
    const [dateOfJoining, setDateOfJoining] = useState(new Date());
    const [dateOfAppointmentCurrentRank, setDateOfAppointmentCurrentRank] = useState(new Date());

    const [fullName, setFullName] = useState('');
    const [isFullNameError, setIsFullNameError] = useState(false);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');

    const [emailID, setEmailID] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [phoneNo, setPhoneNo] = useState('');
    const [isPhoneNoError, setIsPhoneNoError] = useState(false);
    const [phoneNoErrorMessage, setPhoneNoErrorMessage] = useState('');

    const [aadhaarNo, setAadhaarNo] = useState('');
    const [isAadhaarNoError, setIsAadhaarNoError] = useState(false);
    const [aadhaarNoErrorMessage, setAadhaarNoErrorMessage] = useState('');

    const [kgid, setKgid] = useState('');
    const [isKgidError, setIsKgidError] = useState(false);
    const [kgidErrorMessage, setKgidErrorMessage] = useState('');

    const [currentUnit, setCurrentUnit] = useState(0);
    const [isCurrentUnitError, setIsCurrentUnitError] = useState(false);
    const [currentUnitErrorMessage, setCurrentUnitErrorMessage] = useState('');

    const [designation, setDesignation] = useState(0);
    const [isDesignationError, setIsDesignationError] = useState(false);
    const [designationErrorMessage, setDesignationErrorMessage] = useState('');

    const [customDesignation, setCustomDesignation] = useState('');
    const [isCustomDesignationError, setIsCustomDesignationError] = useState(false);
    const [customDesignationErrorMessage, setCustomDesignationErrorMessage] = useState('');

    const [showCustomDesignation, setShowCustomDesignation] = useState(false);

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

    const [isDiscaimerChecked, setIsDisclaimerChecked] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [ipAddress, setIpAddress] = useState('103');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const getUserIpAddress = async () => {
        try {
            const getIpReq = await axios.get(`https://geolocation-db.com/json/`);
            setIpAddress(getIpReq.data.IPv4);
        } catch (error) {}
    }

    useEffect(() => {
        getUserIpAddress();
    }, []);

    const getDistrictsHandler = async () => {
        try {
            const getDistrictReq = await axios.get(`${API_URL}district`);
            if (getDistrictReq.status === 200) {
                setDistricts(getDistrictReq.data.items);
            }
        } catch (error) {}
    }

    useEffect(() => {
        getDistrictsHandler();
    }, []);

    const getDesigntionsHandler = async () => {
        try {
            const getDesignationReq = await axios.get(`${API_URL}designation`);
            if (getDesignationReq.status === 200) {
                setDesignations(getDesignationReq.data.items);
            }
        } catch (error) {}
    }

    useEffect(() => {
        getDesigntionsHandler();
    }, []);

    const CustomDatepickerInput = forwardRef(({
        value,
        onClick
    }, ref) => ( <
        button className = "pageContentSectionFormStepInputTxt datePickerInput"
        onClick = {
            onClick
        }
        ref = {
            ref
        } > {
            value
        } <
        /button>
    ));

    const handleFullNameChanged = (e) => {

        const isFullNameValid = disableSpecialCharacter(e);

        if (isFullNameValid) {
            setFullName(e);
            setIsFullNameError(false);
            setFullNameErrorMessage('');
        } else if (e.length === 0) {
            setFullName('');
            setIsFullNameError(true);
            setFullNameErrorMessage('Full Name is Required');
        }
    }

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

    const handlePhoneChanged = (e) => {

        const isPhoneNumberValid = allowOnlyNumbers(e);

        if (isPhoneNumberValid) {
            if (phoneNo.length >= 10) {
                if (e.length >= 10) {
                    return
                }
            }
            setPhoneNo(e);
            setIsPhoneNoError(false);
            setPhoneNoErrorMessage('');
        } else if (e.length === 0) {
            setPhoneNo('');
            setIsPhoneNoError(true);
            setPhoneNoErrorMessage('Phone Number is Required');
        }
    }

    const handleAadhaarChanged = (e) => {

        const isAadhaarNumberValid = allowOnlyNumbers(e);

        if (isAadhaarNumberValid) {
            if (aadhaarNo.length >= 12) {
                if (e.length >= 12) {
                    return
                }
            }
            setAadhaarNo(e);
            setIsAadhaarNoError(false);
            setAadhaarNoErrorMessage('');
        } else if (e.length === 0) {
            setAadhaarNo('');
            setIsAadhaarNoError(true);
            setAadhaarNoErrorMessage('Aadhaar Number is Required');
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

    useEffect(() => {
        if (designation == "64011a5148707683e2faebc9") {
            setShowCustomDesignation(true);
            setIsDesignationError(false);
            setDesignationErrorMessage("");
        } else if (designation == 0) {
            setShowCustomDesignation(false);
            // setIsDesignationError(true);
            // setDesignationErrorMessage("Designation is Required");
        } else {
            setShowCustomDesignation(false);
            // setIsDesignationError(false);
            // setDesignationErrorMessage("");
        }
    }, [designation]);

    // useEffect(() => {
    //     if(currentUnit == 0){
    //         setIsCurrentUnitError(true);
    //         setCurrentUnitErrorMessage("Current Unit is Required");
    //     }
    //     else{
    //         setIsCurrentUnitError(false);
    //         setCurrentUnitErrorMessage("");
    //     }
    // }, [currentUnit]);

    const handleCustomDesignation = (e) => {
        const isCustDesignationValid = disableSpecialCharacter(e);

        if (isCustDesignationValid) {
            setCustomDesignation(e);
            setIsCustomDesignationError(false);
            setCustomDesignationErrorMessage('');
        } else if (e.length === 0) {
            setCustomDesignation('');
            setIsCustomDesignationError(true);
            setCustomDesignationErrorMessage('Designation is Required');
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

    const handleCheckboxChanged = (e) => {
        setIsDisclaimerChecked(e);
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

    const submitEmployeeRegistration = async (e) => {
        e.preventDefault();

        setIsSubmitted(true);

        const isPhoneValid = validatePhoneNumber(phoneNo);
        if (!isPhoneValid) {
            setIsPhoneNoError(true);
            setPhoneNoErrorMessage("Invalid Phone Number");
            notifyError("Enter a Valid Phone Number");
            setIsSubmitted(false);
            return
        } else {
            setIsPhoneNoError(false);
            setPhoneNoErrorMessage("");
        }

        const isAadhaarValid = validateAadhaarNumber(aadhaarNo);
        if (!isAadhaarValid) {
            setIsAadhaarNoError(true);
            setAadhaarNoErrorMessage("Invalid Aadhaar Number");
            notifyError("Enter a Valid Aadhaar Number");
            setIsSubmitted(false);
            return
        } else {
            setIsAadhaarNoError(false);
            setAadhaarNoErrorMessage("");
        }

        if (currentUnit === 0) {
            setIsCurrentUnitError(true);
            setCurrentUnitErrorMessage("Select Your Current Unit");
            notifyError("Select Your Current Unit");
            setIsSubmitted(false);
            return
        } else {
            setIsCurrentUnitError(false);
            setCurrentUnitErrorMessage("");
        }

        if (designation === 0) {
            setIsDesignationError(true);
            setDesignationErrorMessage("Select Your Designation");
            notifyError("Select Your Designation");
            setIsSubmitted(false);
            return
        } else {
            setIsDesignationError(false);
            setDesignationErrorMessage("");
        }

        if (designation === '64011a5148707683e2faebc9') {
            if (customDesignation == '') {
                setIsCustomDesignationError(true);
                setCustomDesignationErrorMessage("Specify Your Designation");
                notifyError("Specify Your Designation");
                setIsSubmitted(false);
                return
            } else {
                setIsCustomDesignationError(false);
                setCustomDesignationErrorMessage("");
            }
        } else {
            setIsCustomDesignationError(false);
            setCustomDesignationErrorMessage("");
        }

        if (repeatPassword != "") {
            if (password != repeatPassword) {
                setIsRepeatPasswordError(true);
                setRepeatPasswordErrorMessage("Password Do Not Match");
                notifyError("Password Do Not Match");
                setIsSubmitted(false);
                return
            }
        } else {
            setIsRepeatPasswordError(false);
            setRepeatPasswordErrorMessage("");
        }

        const data = {
            name: fullName,
            email_id: emailID,
            phone_number: phoneNo,
            aadhaar_number: aadhaarNo,
            kgid: kgid,
            current_unit: currentUnit,
            date_of_joining: dateOfJoining,
            date_of_appointment_current_rank: dateOfAppointmentCurrentRank,
            designation: designation,
            custom_designation: customDesignation,
            password: password,
            ip_address: ipAddress
        }

        try {
            const saveUserReq = await axios.post(`${API_URL}user/register-employee`, data);
            if (saveUserReq.status === 201) {
                navigate('/');
            }
        } catch (error) {
            setIsSubmitted(false);
            if (error.response.status === 403) {
                if (error.response.data.error === 1) {
                    notifyError('Email ID Already Registered');
                } else if (error.response.data.error === 2) {
                    notifyError('Phone Number Already Registered');
                } else if (error.response.data.error === 3) {
                    notifyError('Aadhaar Number Already Registered');
                } else if (error.response.data.error === 4) {
                    notifyError('KGID Already Registered');
                } else {
                    notifyError('Something Went Wrong');
                }
            } else if (error.response.status === 400) {
                notifyError('Few Fields Missing');
            } else if (error.response.status === 404) {
                notifyError('Invalid Request');
            } else {
                notifyError('Something Went Wrong');
            }
        }
    }

    return ( <
        >
        <
        div className = "pageContentSection registerSection" >
        <
        div className = "pageContentSectionHeading" >
        <
        div className = "pageContentSectionHeadingMandatory" >
        <
        i className = "fa-solid fa-star-of-life pageContentSectionHeadingMandatoryIco" > < /i> <
        /div> <
        div className = "pageContentSectionHeadingLable" >
        <
        p className = "pageContentSectionHeadingLableTxt" > Personal Information < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionForm" >
        <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > full name < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = "text"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Full Name"
        onChange = {
            (e) => handleFullNameChanged(e.target.value)
        }
        value = {
            fullName
        }
        /> <
        /div> {
            isFullNameError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    fullNameErrorMessage
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
        /div> <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > phone number < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = "tel"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Phone Number"
        onChange = {
            (e) => handlePhoneChanged(e.target.value)
        }
        value = {
            phoneNo
        }
        /> <
        /div> {
            isPhoneNoError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    phoneNoErrorMessage
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
        p className = "pageContentSectionFormStepHalfLableTxt" > Aadhaar Number < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        input type = "tel"
        className = "pageContentSectionFormStepInputTxt"
        placeholder = "Please Enter Your Aadhaar Number"
        onChange = {
            (e) => handleAadhaarChanged(e.target.value)
        }
        value = {
            aadhaarNo
        }
        /> <
        /div> {
            isAadhaarNoError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    aadhaarNoErrorMessage
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
        div className = "pageContentSection" >
        <
        div className = "pageContentSectionHeading" >
        <
        div className = "pageContentSectionHeadingMandatory" >
        <
        i className = "fa-solid fa-star-of-life pageContentSectionHeadingMandatoryIco" > < /i> <
        /div> <
        div className = "pageContentSectionHeadingLable" >
        <
        p className = "pageContentSectionHeadingLableTxt" > Professional Information < /p> <
        /div> <
        /div>

        <
        div className = "pageContentSectionForm" >
        <
        div className = "pageContentSectionFormStep" >
        <
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
        /div> <
        /div> <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > current unit < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        select className = "pageContentSectionFormStepInputTxt selectInput"
        value = {
            currentUnit
        }
        onChange = {
            (e) => setCurrentUnit(e.target.value)
        } >
        <
        option value = {
            0
        } > Please Select Your Current Unit < /option> {
            districts.map((district) => {
                return ( <
                    option value = {
                        district.id
                    }
                    key = {
                        district.id
                    } > {
                        district.name
                    } < /option>
                )
            })
        } <
        /select> <
        /div> {
            isCurrentUnitError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    currentUnitErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> <
        /div> <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > date of joining < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        DatePicker showYearDropdown yearDropdownItemNumber = {
            25
        }
        scrollableYearDropdown maxDate = {
            new Date()
        }
        selected = {
            dateOfJoining
        }
        onChange = {
            (date) => setDateOfJoining(date)
        }
        customInput = { < CustomDatepickerInput / >
        }
        /> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > date of appointment to current rank < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        DatePicker showYearDropdown yearDropdownItemNumber = {
            25
        }
        scrollableYearDropdown maxDate = {
            new Date()
        }
        minDate = {
            dateOfJoining
        }
        selected = {
            dateOfAppointmentCurrentRank
        }
        onChange = {
            (date) => setDateOfAppointmentCurrentRank(date)
        }

        customInput = { < CustomDatepickerInput / >
        }
        /> <
        /div> <
        /div> <
        /div> <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > designation < /p> <
        /div> <
        div className = "pageContentSectionFormStepInput" >
        <
        select className = "pageContentSectionFormStepInputTxt"
        value = {
            designation
        }
        onChange = {
            (e) => setDesignation(e.target.value)
        } >
        <
        option value = {
            0
        } > Please Select Your Designation < /option> {
            designations.map((designation) => {
                return ( <
                    option className = "uppercase"
                    value = {
                        designation.id
                    }
                    key = {
                        designation.id
                    } > {
                        designation.name
                    } < /option>
                )
            })
        } <
        /select> <
        /div> {
            isDesignationError ?
                <
                div className = "pageContentSectionFormStepError" >
                <
                p className = "pageContentSectionFormStepErrorTxt" > {
                    designationErrorMessage
                } < /p> <
                /div> :
                <
                > < />
        } <
        /div> {
            showCustomDesignation ?
                <
                div className = "pageContentSectionFormStepHalf" >
                <
                div className = "pageContentSectionFormStepLable" >
                <
                p className = "pageContentSectionFormStepHalfLableTxt" > & nbsp; < /p> <
            /div> <
            div className = "pageContentSectionFormStepInput" >
                <
                input type = "text"
            className = "pageContentSectionFormStepInputTxt"
            placeholder = "Please Specify Your Designation"
            value = {
                customDesignation
            }
            onChange = {
                (e) => handleCustomDesignation(e.target.value)
            }
            /> <
            /div> {
                isCustomDesignationError ?
                    <
                    div className = "pageContentSectionFormStepError" >
                    <
                    p className = "pageContentSectionFormStepErrorTxt" > {
                        customDesignationErrorMessage
                    } < /p> <
                    /div> :
                    <
                    > < />
            } <
            /div>:
            <
            > < />
        }

        <
        /div> <
        /div> <
        /div>


        <
        div className = "pageContentSection" >
        <
        div className = "pageContentSectionHeading" >
        <
        div className = "pageContentSectionHeadingMandatory" >
        <
        i className = "fa-solid fa-star-of-life pageContentSectionHeadingMandatoryIco" > < /i> <
        /div> <
        div className = "pageContentSectionHeadingLable" >
        <
        p className = "pageContentSectionHeadingLableTxt" > Choose Your Password < /p> <
        /div> <
        /div>

        <
        div className = "pageContentSectionForm" >
        <
        div className = "pageContentSectionFormStep" >
        <
        div className = "pageContentSectionFormStepHalf" >
        <
        div className = "pageContentSectionFormStepLable" >
        <
        p className = "pageContentSectionFormStepHalfLableTxt" > Password < /p> <
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
        div className = "pageContentSectionFormStepHalf" >
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
        placeholder = "Please Confirm Your Password"
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
        /div>

        <
        div className = "pageContentSection sectionConfirm" >
        <
        div className = "pageContentSectionDisclaimer" >
        <
        div className = "pageContentSectionDisclaimerCheck" >
        <
        label className = "checkbox" >
        <
        input type = "checkbox"
        name = "disclaimer"
        value = {
            isDiscaimerChecked
        }
        checked = {
            isDiscaimerChecked
        }
        onChange = {
            (e) => handleCheckboxChanged(e.target.checked)
        }
        /> <
        span className = "checkmark" > < /span> <
        /label> <
        /div> <
        div className = "pageContentSectionDisclaimerContent" >
        <
        p className = "pageContentSectionDisclaimerContentTxt" > I hereby declare that the information furnished above is true, complete and correct to the best of my knowledge and belief. < /p> <
        /div> <
        /div> <
        div className = "pageContentSectionConfirmButton" >
        <
        button onClick = {
            (e) => submitEmployeeRegistration(e)
        }
        className = "pageContentSectionConfirmButtonInput"
        type = {
            'button'
        }
        disabled = {
            fullName == "" || emailID == "" || phoneNo == "" || aadhaarNo == "" || kgid == "" || currentUnit == 0 || designation == 0 || password == "" || repeatPassword == "" || isFullNameError || isEmailError || isPhoneNoError || isAadhaarNoError || isKgidError || isCurrentUnitError || isDesignationError || isPasswordError || isRepeatPasswordError || !isDiscaimerChecked || isSubmitted
        } > Submit < /button> <
        /div> <
        /div> <
        />
    )
}

export default Registration