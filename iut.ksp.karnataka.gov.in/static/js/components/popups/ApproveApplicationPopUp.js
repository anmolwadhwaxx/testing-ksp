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
    notifyError,
    notifySuccess
} from '../../utils/toastify';

const ApproveApplicationPopUp = ({
    config,
    API_URL,
    requestId,
    hidePopUp,
    reportSuccess
}) => {
    const navigate = useNavigate();

    const [remarks, setRemarks] = useState("");
    const [showRemarks, setShowRemarks] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitApproveRequest = async () => {
        if (remarks.length == 0) {
            return notifyError("Remarks is required");
        }

        setIsSubmitted(true);

        const data = {
            remark: remarks
        }

        try {
            const approveApplicationReq = await axios.patch(`${API_URL}transfer-request/approve/${requestId}`, data, config);
            if (approveApplicationReq.status === 200) {
                reportSuccess(true);
                notifySuccess("Application Successfully Approved.");
            }
        } catch (error) {
            setIsSubmitted(false);
        }
    }

    return ( <
        div className = "alertContainer" >
        <
        div className = "alertPopUp" > {
            showRemarks ?
            <
            div className = "alertPopUpStep" >
            <
            div className = "alertPopUpRemarks" >
            <
            div className = "alertPopUpRemarksHeading" >
            <
            p className = "alertPopUpRemarksHeadingTxt" > Specify The Reason For Approving This Application < /p> <
            /div>

            <
            div className = "alertPopUpRemarksInput" >
            <
            textarea className = "alertPopUpRemarksInputTxtarea"
            rows = "4"
            placeholder = "Please Enter The Reason *"
            onChange = {
                (e) => setRemarks(e.target.value)
            } > < /textarea> <
            /div>

            <
            div className = "alertPopUpRemarksNote" >
            <
            p className = "alertPopUpRemarksNoteTxt" > Your remarks will help us understand better.So do enter a valid reason. < /p> <
                /div>

                <
                div className = "alertPopUpRemarksActions" >
                <
                div className = "alertPopUpActionsMain" >
                <
                button className = "alertPopUpActionSingle"
            disabled = {
                isSubmitted
            }
            onClick = {
                () => handleSubmitApproveRequest()
            } > submit < /button> <
            button className = "alertPopUpActionSingle danger"
            onClick = {
                () => hidePopUp()
            } > close < /button> <
            /div> <
            /div> <
            /div> <
            /div> :
                <
                div className = "alertPopUpStep" >
                <
                div className = "alertPopUpContent" >
                <
                div className = "alerPopUpContentIcon" >
                <
                i className = "fa-solid fa-triangle-exclamation alerPopUpContentIco" > < /i> <
                /div> <
                div className = "alerPopUpContentHeadingDescription" >
                <
                div className = "alerPopUpContentHeading" >
                <
                p className = "alerPopUpContentHeadingTxt" > Are you sure ? < /p> <
                /div> <
                div className = "alerPopUpContentDescription" >
                <
                p className = "alerPopUpContentDescriptionTxt" > You are one step away to approve the transfer request.Do you really want to approve ? Click on
            continue
            if you are willing to approve or click on close to go back. < /p> <
            /div> <
            /div> <
            /div> <
            div className = "alertPopUpActions" >
            <
            div className = "alertPopUpActionsMain" >
            <
            button className = "alertPopUpActionSingle"
            onClick = {
                () => setShowRemarks(true)
            } >
            continue < /button> <
                button className = "alertPopUpActionSingle danger"
            onClick = {
                () => hidePopUp()
            } > close < /button> <
            /div> <
            /div> <
            /div>
        } <
        /div> <
        /div>
    )
}

export default ApproveApplicationPopUp