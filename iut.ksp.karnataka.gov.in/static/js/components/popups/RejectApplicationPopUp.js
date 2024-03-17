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

const RejectApplicationPopUp = ({
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

    const handleSubmitRejectRequest = async () => {
        if (remarks.length == 0) {
            return notifyError("Remarks is required");
        }

        setIsSubmitted(true);

        const data = {
            remark: remarks
        }

        try {
            const rejectApplicationReq = await axios.patch(`${API_URL}transfer-request/reject/${requestId}`, data, config);
            if (rejectApplicationReq.status === 200) {
                reportSuccess(true);
                notifySuccess("Application Successfully Rejected.");
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
            p className = "alertPopUpRemarksHeadingTxt" > Specify The Reason For Rejecting This Application < /p> <
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
                () => handleSubmitRejectRequest()
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
                p className = "alerPopUpContentDescriptionTxt" > You are one step away to reject the transfer request.Do you really want to reject ? Click on
            continue
            if you are willing to accept or click on close to go back. < /p> <
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

export default RejectApplicationPopUp