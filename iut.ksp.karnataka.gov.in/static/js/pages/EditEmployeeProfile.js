import React, {
    useState,
    useEffect,
    forwardRef
} from 'react';
import axios from 'axios';
import {
    useNavigate
} from 'react-router-dom';
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
    notifyError,
    notifySuccess
} from '../utils/toastify';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    login
} from '../reducers/user';
import ChangePasswordPopUp from '../components/popups/ChangePasswordPopUp';

const EditEmployeeProfile = ({
    API_URL
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.value);

    const [userDetails, setUserDetails] = useState({});

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

    const [isDiscaimerChecked, setIsDisclaimerChecked] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [isShowChangePasswordPopUp, setIsShowChangePasswordPopUp] = useState(false);

    const config = {
        headers: {
            'Authorization': user.access_token
        }
    }

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

    const CustomDatepickerReadonlyInput = forwardRef(({
        value,
        onClick
    }, ref) => ( <
        button className = "pageContentSectionFormStepInputTxt datePickerInput readonly"
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

    const getThisUserHandler = async () => {
        try {
            const getThisUserReq = await axios.get(`${API_URL}user/employee/${user.id}`, config);
            if (getThisUserReq.status === 200) {
                setUserDetails(getThisUserReq.data);
                setFullName(getThisUserReq.data.name);
                setPhoneNo(getThisUserReq.data.phone_number);
                setEmailID(getThisUserReq.data.email_id);
                setAadhaarNo(getThisUserReq.data.aadhaar_number);
                setKgid(getThisUserReq.data.kgid);
                setCurrentUnit(getThisUserReq.data.unit);
                setDateOfJoining(new Date(getThisUserReq.data.joining_date));
                setDateOfAppointmentCurrentRank(new Date(getThisUserReq.data.recent_transfer_date));
                setDesignation(getThisUserReq.data.designation.id);
            } else {
                setUserDetails({});
            }
        } catch (error) {}
    }

    useEffect(() => {
        getThisUserHandler();
    }, []);

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

    const editEmployeeProfile = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        setIsSubmitted(true);

        const isPhoneValid = validatePhoneNumber(phoneNo);
        if (!isPhoneValid) {
            setIsPhoneNoError(true);
            setPhoneNoErrorMessage("Invalid Phone Number");
            notifyError("Enter a Valid Phone Number");
            setIsLoading(false);
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
            setIsLoading(false);
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
            setIsLoading(false);
            setIsSubmitted(false);
            return
        } else {
            setIsCurrentUnitError(false);
            setCurrentUnitErrorMessage("");
        }

        const data = {
            name: fullName,
            phone_number: phoneNo,
            aadhaar_number: aadhaarNo,
            kgid: kgid,
            current_unit: currentUnit,
            designation: designation,
            date_of_appointment_current_rank: dateOfAppointmentCurrentRank
        }

        try {
            const saveUserReq = await axios.patch(`${API_URL}user/employee/${user.id}`, data, config);
            if (saveUserReq.status === 200) {
                dispatch(login({
                    id: user.id,
                    name: fullName,
                    role: user.role,
                    email_id: user.email_id,
                    joining_date: user.joining_date,
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                    profile_pic: user.profile_pic,
                    is_logged_in: true
                }));
                navigate('/dashboard');
                notifySuccess("Your Details Have Been Successfully Updated");
                setIsSubmitted(false);
            } else {
                setIsSubmitted(false);
            }
        } catch (error) {
            setIsSubmitted(false);
            setIsLoading(false);
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

    const passwordChangePopUpSuccess = (e) => {
        if (e === true) {
            notifySuccess("Password Successfully Updated");
            setIsShowChangePasswordPopUp(false);
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
        className = "pageContentSectionFormStepInputTxt readonly"
        placeholder = "Please Enter Your Email ID"
        readOnly = {
            true
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
        customInput = { < CustomDatepickerReadonlyInput / >
        }
        readOnly = {
            true
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
        /select> { /* <input type="text" className="pageContentSectionFormStepInputTxt readonly" placeholder="Please Enter Your Designation" readOnly={true} value={designation} /> */ } <
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
        p className = "pageContentSectionHeadingLableTxt" > Change Password ? < /p> <
        /div> <
        div className = "pageContentSectionHeadingAction" >
        <
        p className = "pageContentSectionHeadingActionTxt"
        onClick = {
            () => setIsShowChangePasswordPopUp(true)
        } > Click Here < /p> <
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
            (e) => editEmployeeProfile(e)
        }
        className = "pageContentSectionConfirmButtonInput"
        type = {
            'button'
        }
        disabled = {
            fullName == "" || phoneNo == "" || aadhaarNo == "" || kgid == "" || currentUnit == 0 || isFullNameError || isPhoneNoError || isAadhaarNoError || isKgidError || isCurrentUnitError || !isDiscaimerChecked || isLoading || isSubmitted
        } > Submit < /button> <
        /div> <
        /div>

        {
            isShowChangePasswordPopUp
                ?
                <
                ChangePasswordPopUp config = {
                    config
                }
            API_URL = {
                API_URL
            }
            user = {
                user
            }
            hidePopUp = {
                () => setIsShowChangePasswordPopUp(false)
            }
            reportSuccess = {
                (e) => passwordChangePopUpSuccess(e)
            }
            />:
            <
            > < />
        } <
        />
    )
}

export default EditEmployeeProfile