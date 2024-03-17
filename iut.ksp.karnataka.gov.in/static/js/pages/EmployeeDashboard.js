import React, {
    useState,
    useEffect,
    forwardRef
} from 'react';
import axios from 'axios';

import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    logout
} from '../reducers/user';

import {
    useNavigate
} from 'react-router-dom';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import {
    API_BASE_URL
} from '../config';
import {
    notifyError,
    notifySuccess
} from '../utils/toastify';

import moment from 'moment';
import RequestDetailsPopUp from '../components/popups/RequestDetailsPopUp';
import WithdrawApplicationPopUp from '../components/popups/WithdrawApplicationPopUp';

const EmployeeDashboard = ({
    API_URL
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.value);

    const [districts, setDistricts] = useState([]);
    const [transferReasons, setTransferReasons] = useState([]);

    const [category, setCategory] = useState(0);
    const [isCategoryError, setIsCategoryError] = useState(false);
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");

    const [motherUnit, setMotherUnit] = useState(0);
    const [isMotherUnitError, setIsMotherUnitError] = useState(false);
    const [motherUnitErrorMessage, setMotherUnitErrorMessage] = useState("");

    const [destinationUnit, setDestinationUnit] = useState(0);
    const [isDestinationUnitError, setIsDestinationUnitError] = useState(false);
    const [destinationUnitErrorMessage, setDestinationUnitErrorMessage] = useState("");

    const [fileID, setFileID] = useState('');
    const [fileURL, setIsFileUrl] = useState('');
    const [isFileError, setIsFileError] = useState(false);
    const [fileErrorMessage, seFileErrorMessage] = useState('');

    const [ipAddress, setIpAddress] = useState('');

    const [isDiscaimerChecked, setIsDisclaimerChecked] = useState(false);

    const [transferRequest, setTransferRequest] = useState({});
    const [isTransferRequested, setIsTransferRequested] = useState(false);
    const [isApplyForTransfer, setIsApplyForTransfer] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
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

    const config = {
        headers: {
            'Authorization': user.access_token
        }
    }

    const resetApplyForTransferForm = () => {
        setCategory(0);
        setMotherUnit(0);
        setDestinationUnit(0);
        setFileID('');
        setIsFileUrl('');
        setIsDisclaimerChecked(false);
    }

    const getUserTransfersHandler = async () => {

        try {
            const getUserTransfersReq = await axios.get(`${API_URL}transfer-request/user-request`, config);
            if (getUserTransfersReq.status === 200) {
                setTransferRequest(getUserTransfersReq.data);
                setIsApplyForTransfer(false);
                setIsTransferRequested(true);
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setIsApplyForTransfer(true);
                setIsLoading(false);
            } else {}
        }
    }

    useEffect(() => {
        getUserTransfersHandler();
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

    const getTransferReasonsHandler = async () => {
        try {
            const getTransferReasonReq = await axios.get(`${API_URL}transfer-reason`);
            if (getTransferReasonReq.status === 200) {
                setTransferReasons(getTransferReasonReq.data.items);
            }
        } catch (error) {}
    }

    useEffect(() => {
        getTransferReasonsHandler();
    }, []);

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const validateTransferEligiblity = async () => {

        // let categoryData = transferReasons.find(id => category);

        let categoryData = transferReasons.find(reason => reason.id === category);

        const joining_date = user.joining_date.slice(0, 10);

        let today = new Date();
        let current_date = formatDate(today);

        let current_year = new Date(current_date);
        let joining_year = new Date(joining_date);

        const diffTime = Math.abs(current_year - joining_year);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let tempDifferenceYear = diffDays / 365;
        let differenceYear = Math.floor(tempDifferenceYear);

        if (differenceYear >= categoryData ? .years) {
            setIsCategoryError(false);
            setCategoryErrorMessage("");
        } else {
            setIsCategoryError(true);
            setCategoryErrorMessage(`You are not eligible for this request.`);
        }
    }

    useEffect(() => {
        if (category != 0) {
            validateTransferEligiblity();
        }
    }, [category]);

    const handleMotherUnitChange = (e) => {
        if (destinationUnit == e) {
            notifyError('Both Mother Unit & Destination Unit Cannot Be Same');
            setMotherUnit(0);
        } else {
            setMotherUnit(e);
        }
    }

    const handleDestinationUnitChange = (e) => {
        if (motherUnit == e) {
            notifyError('Both Mother Unit & Destination Unit Cannot Be Same');
            setDestinationUnit(0);
        } else {
            setDestinationUnit(e);
        }
    }

    const handleCheckboxChanged = (e) => {
        setIsDisclaimerChecked(e);
    }

    const [formImage, setImage] = useState();

    const handleFileUpload = async (e) => {
        e.preventDefault();
        //setIsImageValid(e.target.files[0]);
        const image = e.target.files[0];
        setImage(image);

        const config_multipart = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': user.access_token
            }
        };

        var formData = new FormData();
        formData.append(`file_url`, image);

        try {
            const uploadReq = await axios.post(`${API_URL}media`, formData, config_multipart);
            if (uploadReq.status === 200) {
                setFileID(uploadReq.data.id);
                notifySuccess('Attachment Successfully Uploaded');
                setIsFileError(false);
            } else {
                setIsFileError(true);
                notifyError('Something Went Wrong');
            }
        } catch (error) {
            if (error.response.status === 400) {
                setIsFileError(true);
                notifyError('File Format Not Supported');
            } else {
                setIsFileError(true);
                notifyError('Something Went Wrong');
            }
        }
    }

    const submitTransferRequest = async (e) => {
        e.preventDefault();

        setIsSubmitted(true);

        const data = {
            mother_unit: motherUnit,
            destination_unit: destinationUnit,
            category: category,
            media: fileID,
            ip_address: ipAddress,
            user_id: user.id
        }

        try {
            const saveTransferRequest = await axios.post(`${API_URL}transfer-request`, data, config);
            if (saveTransferRequest.status === 201) {
                getUserTransfersHandler();
                resetApplyForTransferForm();
            }
        } catch (error) {
            setIsSubmitted(false);
        }
    }

    const handleWithdrawSuccess = async (e) => {
        if (e == true) {
            setShowWithdrawPopup(false);
            getUserTransfersHandler();
        }
    }

    return ( <
        >

        {
            isApplyForTransfer ?
            <
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
            p className = "pageContentSectionHeadingLableTxt" > {
                isLoading ?
                `Please Wait!` :
                    isApplyForTransfer ?
                    `Apply For Transfer` :
                    isTransferRequested ?
                    `Transfer Requested!` :
                    <
                    > < />
            } <
            /p> <
            /div> <
            /div>

            <
            form onSubmit = {
                (e) => submitTransferRequest(e)
            } >
            <
            div className = "pageContentSectionForm" >
            <
            div className = "pageContentSectionFormStep" >
            <
            div className = "pageContentSectionFormStepHalf" >
            <
            div className = "pageContentSectionFormStepLable" >
            <
            p className = "pageContentSectionFormStepHalfLableTxt" > category < /p> <
            /div> <
            div className = "pageContentSectionFormStepInput" >
            <
            select className = "pageContentSectionFormStepInputTxt selectInput"
            value = {
                category
            }
            onChange = {
                (e) => setCategory(e.target.value)
            } >
            <
            option value = {
                0
            } > Please Select Your Category < /option> {
                transferReasons.map((reason) => {
                    return ( <
                        option value = {
                            reason.id
                        }
                        key = {
                            reason.id
                        } > {
                            reason.name
                        } < /option>
                    )
                })
            } <
            /select> <
            /div> {
                isCategoryError ?
                    <
                    div className = "pageContentSectionFormStepError" >
                    <
                    p className = "pageContentSectionFormStepErrorTxt" > {
                        categoryErrorMessage
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
            p className = "pageContentSectionFormStepHalfLableTxt" > mother unit < /p> <
            /div> <
            div className = "pageContentSectionFormStepInput" >
            <
            select className = "pageContentSectionFormStepInputTxt selectInput"
            value = {
                motherUnit
            }
            onChange = {
                (e) => handleMotherUnitChange(e.target.value)
            } >
            <
            option value = {
                0
            } > Please Select Your Mother Unit < /option> {
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
            /div> <
            /div> <
            /div>

            <
            div className = "pageContentSectionFormStep" >
            <
            div className = "pageContentSectionFormStepHalf" >
            <
            div className = "pageContentSectionFormStepLable" >
            <
            p className = "pageContentSectionFormStepHalfLableTxt" > destination unit < /p> <
            /div> <
            div className = "pageContentSectionFormStepInput" >
            <
            select className = "pageContentSectionFormStepInputTxt selectInput"
            value = {
                destinationUnit
            }
            onChange = {
                (e) => handleDestinationUnitChange(e.target.value)
            } >
            <
            option value = {
                0
            } > Please Select Your Destination Unit < /option> {
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
            /div>

            <
            /div> <
            div className = "pageContentSectionFormStepHalf" >
            <
            div className = "pageContentSectionFormStepLable" >
            <
            p className = "pageContentSectionFormStepHalfLableTxt" > attachment(Optional) < /p> <
            /div> <
            div className = "pageContentSectionFormStepInput" >
            <
            input type = "file"
            className = 'pageContentSectionFormStepInputTxt'
            onChange = {
                (e) => handleFileUpload(e)
            }
            /> <
            /div> <
            /div> <
            /div> <
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
            p className = "pageContentSectionDisclaimerContentTxt" > I hereby declare that the information furnished above is true,
            complete and correct to the best of my knowledge and belief. < /p> <
            /div> <
            /div> <
            div className = "pageContentSectionConfirmButton" >
            <
            button className = "pageContentSectionConfirmButtonInput"
            type = {
                'submit'
            }
            disabled = {
                category == 0 || motherUnit == 0 || destinationUnit == 0 || isCategoryError || isMotherUnitError || isDestinationUnitError || !isDiscaimerChecked || isSubmitted
            } > Submit < /button> <
            /div> <
            /div> <
            /div> <
            /form> <
            /div> <
            /> :
                isTransferRequested ?
                <
                > {
                    /* <div className="pageMessageSection">
                                            <div className="pageMessageSectionInner">
                                                <div className="pageMessageSectionIcon">
                                                    <i className="fa-regular fa-circle-check pageMessageSectionIco"></i>
                                                </div>
                                                <div className="pageMessageSectionContent">
                                                    <div className="pageMessageSectionContentHeading">
                                                        {
                                                            transferRequest.createdAt != undefined
                                                            ?
                                                                <p className="pageMessageSectionContentHeadingTxt">Your application number {transferRequest.application_id} was successfully submitted at {moment(transferRequest.createdAt).format('MMMM Do YYYY, h:mm:ss a')}.</p>
                                                            :
                                                                <p className="pageMessageSectionContentHeadingTxt">Your application number {transferRequest.application_id} was successfully submitted.</p>
                                                        }
                                                    </div>
                                                    <div className="pageMessageSectionContentDescription">
                                                        <p className="pageMessageSectionContentDescriptionTxt">Your application will be processed on first come first serve basis by Police Headquarter subject to vacancy and your eligibility. Thank you. KSP</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <RequestDetailsPopUp />
                                        </div> */
                }

                <
                div className = "pageRequestFoundSection" >
                <
                div className = "pageRequestFoundSectionHeadings" >
                <
                div className = "pageRequestFoundSectionHeadingLable" >
                <
                p className = "pageRequestFoundSectionHeadingLableTxt" > Your Transfer Request Has Been Successfully Submitted. < /p> <
                /div> <
                div className = "pageRequestFoundSectionDescriptionLable" >
                <
                p className = "pageRequestFoundSectionDescriptionLableTxt" > Find your request details below,
            you can withdraw the transfer request and re apply
            if there 's any change in requested details.</p> <
            p className = "pageRequestFoundSectionDescriptionLableTxt" > < b > Please Note: < /b> Your seniority will be removed and the new application ID will be generated if in case of new request submission.</p >
                <
                /div> <
                /div>

                <
                div className = "pageRequestFoundSectionDetails" >
                <
                div className = "pageRequestFoundSectionDetailsHeading" >
                <
                p className = "pageRequestFoundSectionDetailsHeadingTxt" > Application ID: {
                    transferRequest.application_id
                } < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContent" >
                <
                div className = "pageRequestFoundSectionDetailsContentStep" >
                <
                div className = "pageRequestFoundSectionDetailsContentStepLable" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepLableTxt" > mother unit < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepSeperator" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepField" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepFieldTxt" > {
                    transferRequest.mother_unit.name
                } < /p> <
                /div> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStep" >
                <
                div className = "pageRequestFoundSectionDetailsContentStepLable" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepLableTxt" > destination unit < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepSeperator" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepField" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepFieldTxt" > {
                    transferRequest.destination_unit.name
                } < /p> <
                /div> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStep" >
                <
                div className = "pageRequestFoundSectionDetailsContentStepLable" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepLableTxt" > category < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepSeperator" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsContentStepField" >
                <
                p className = "pageRequestFoundSectionDetailsContentStepFieldTxt" > {
                    transferRequest.category.name
                } < /p> <
                /div> <
                /div> {
                    transferRequest.attachment != undefined ?
                        <
                        div className = "pageRequestFoundSectionDetailsContentStep" >
                        <
                        div className = "pageRequestFoundSectionDetailsContentStepLable" >
                        <
                        p className = "pageRequestFoundSectionDetailsContentStepLableTxt" > attachment < /p> <
                        /div> <
                        div className = "pageRequestFoundSectionDetailsContentStepSeperator" >
                        <
                        p className = "pageRequestFoundSectionDetailsContentStepSeperatorTxt" > : < /p> <
                        /div> <
                        div className = "pageRequestFoundSectionDetailsContentStepField" >
                        <
                        a className = "pageRequestFoundSectionDetailsContentStepFieldTxt action"
                    href = {
                        transferRequest.attachment.url
                    }
                    target = "blank" > View Attachment < /a> <
                        /div> <
                        /div>:
                        <
                        > < />
                } {
                    transferRequest.createdAt != undefined ?
                        <
                        div className = "pageRequestFoundSectionDetailsContentStep" >
                        <
                        div className = "pageRequestFoundSectionDetailsContentStepLable" >
                        <
                        p className = "pageRequestFoundSectionDetailsContentStepLableTxt" > applied on < /p> <
                        /div> <
                        div className = "pageRequestFoundSectionDetailsContentStepSeperator" >
                        <
                        p className = "pageRequestFoundSectionDetailsContentStepSeperatorTxt" > : < /p> <
                        /div> <
                        div className = "pageRequestFoundSectionDetailsContentStepField" >
                        <
                        p className = "pageRequestFoundSectionDetailsContentStepFieldTxt" > {
                            moment(transferRequest.createdAt).format('MMMM Do YYYY, h:mm:ss a')
                        } < /p> <
                        /div> <
                        /div>:
                        <
                        > < />
                } <
                /div>

                <
                div className = "pageRequestFoundSectionDetailsStatusAction" >
                <
                div className = "pageRequestFoundSectionDetailsStatus" >
                <
                div className = "pageRequestFoundSectionDetailsStatusLable" >
                <
                p className = "pageRequestFoundSectionDetailsStatusLableTxt" > Current Status < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsStatusSeperator" >
                <
                p className = "pageRequestFoundSectionDetailsStatusSeperatorTxt" >: < /p> <
                /div> <
                div className = "pageRequestFoundSectionDetailsStatusField" >
                <
                p className = "pageRequestFoundSectionDetailsStatusFieldTxt" > {
                    transferRequest.is_approved === false && transferRequest.is_rejected === false && transferRequest.is_withdrawn === false ? 'Applied' : transferRequest.is_withdrawn === true ? 'Withdrawn' : transferRequest.is_approved === true ? 'Approved' : transferRequest.is_rejected === true ? 'Rejected' : 'Applied'
                } < /p> <
                /div> <
                /div>

                <
                div className = "pageRequestFoundSectionDetailsAction" > {
                    transferRequest.is_approved === false && transferRequest.is_rejected === false && transferRequest.is_withdrawn === false ?
                    <
                    >
                    <
                    div className = "pageRequestFoundSectionDetailsActionSingle"
                    onClick = {
                        () => setShowWithdrawPopup(true)
                    } >
                    <
                    p className = "pageRequestFoundSectionDetailsActionSingleTxt" > Withdraw < /p> <
                    /div> <
                    /> :
                        <
                        > < />
                } <
                /div> <
                /div> <
                /div> <
                /div>

            {
                showWithdrawPopup
                    ?
                    <
                    WithdrawApplicationPopUp config = {
                        config
                    }
                API_URL = {
                    API_URL
                }
                requestId = {
                    transferRequest.id
                }
                hidePopUp = {
                    () => setShowWithdrawPopup(false)
                }
                reportSuccess = {
                    (e) => handleWithdrawSuccess(e)
                }
                />:
                <
                > < />
            }

            <
            />:
                <
                > < />
        } <
        />

    )
}

export default EmployeeDashboard