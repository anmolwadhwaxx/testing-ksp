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
    API_BASE_URL,
    DEFAULT_PAGE_SIZE,
    FIRST_PAGE
} from '../config';
import {
    notifyError
} from '../utils/toastify';

import moment from 'moment';
import Pagination from '../utils/pagination';
import RequestDetailsPopUp from '../components/popups/RequestDetailsPopUp';
import ApproveApplicationPopUp from '../components/popups/ApproveApplicationPopUp';
import RejectApplicationPopUp from '../components/popups/RejectApplicationPopUp';

const AdminDashboard = ({
    API_URL
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const user = useSelector((state) => state.user.value);

    const config = {
        headers: {
            'Authorization': user.access_token
        }
    }

    const [districts, setDistricts] = useState([]);
    const [transferReasons, setTransferReasons] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [category, setCategory] = useState(0);
    const [isCategoryError, setIsCategoryError] = useState(false);
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");

    const [motherUnit, setMotherUnit] = useState(0);
    const [isMotherUnitError, setIsMotherUnitError] = useState(false);
    const [motherUnitErrorMessage, setMotherUnitErrorMessage] = useState("");

    const [destinationUnit, setDestinationUnit] = useState(0);
    const [isDestinationUnitError, setIsDestinationUnitError] = useState(false);
    const [destinationUnitErrorMessage, setDestinationUnitErrorMessage] = useState("");

    const [designation, setDesignation] = useState(0);
    const [isDesignationError, setIsDesignationError] = useState(false);
    const [designationErrorMessage, setDesignationErrorMessage] = useState("");

    const [fromDate, setFromDate] = useState(new Date('03-04-2023'));
    const [toDate, setToDate] = useState(new Date());

    const [isLatest, setIsLatest] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [isWithdrawn, setIsWithdrawn] = useState(false);

    const [stats, setStats] = useState({
        total_users: 0,
        overall_requests: 0,
        approved_requests: 0,
        rejected_requests: 0
    });

    const [requests, setRequests] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [showAllRequests, setShowAllRequests] = useState(true);
    const [showRequestDetails, setShowRequestDetails] = useState(false);

    const [requestId, setRequestId] = useState(0);
    const [requestDetails, setRequestDetails] = useState({});

    const [ipAddress, setIpAddress] = useState('');

    const [approveRequestId, setApproveRequestId] = useState(0);
    const [rejectRequestId, setRejectRequestId] = useState(0);

    const [showApproveRequestPopUp, setShowApproveRequestPopUp] = useState(false);
    const [showRejectRequestPopUp, setShowRejectRequestPopUp] = useState(false);

    const getUserIpAddress = async () => {
        try {
            const getIpReq = await axios.get(`https://geolocation-db.com/json/`);
            setIpAddress(getIpReq.data.IPv4);
        } catch (error) {}
    }

    useEffect(() => {
        getUserIpAddress();
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

    const getStatsHandler = async () => {
        try {
            const getStatsReq = await axios.get(`${API_URL}transfer-request/stats`, config);
            if (getStatsReq.status === 200) {
                setStats({
                    total_users: getStatsReq.data.total_users,
                    overall_requests: getStatsReq.data.overall_requests,
                    approved_requests: getStatsReq.data.approved_requests,
                    rejected_requests: getStatsReq.data.rejected_requests
                })
            }
        } catch (error) {}
    }

    useEffect(() => {
        getStatsHandler();
    }, []);

    const getDistrictsHandler = async () => {
        try {
            const getDistrictReq = await axios.get(`${API_URL}district`);
            if (getDistrictReq.status === 200) {
                setDistricts(getDistrictReq.data.items);
                setTotalPages(getDistrictReq.data.totalPages);
            }
        } catch (error) {}
    }

    useEffect(() => {
        getDistrictsHandler();
    }, []);

    const getTransferReasonsHandler = async () => {
        try {
            const getTransferReasonReq = await axios.get(`${API_URL}transfer-reason`, config);
            if (getTransferReasonReq.status === 200) {
                setTransferReasons(getTransferReasonReq.data.items);
            }
        } catch (error) {}
    }

    useEffect(() => {
        getTransferReasonsHandler();
    }, []);

    const getDesignationsHandler = async () => {
        try {
            const getDesignationReq = await axios.get(`${API_URL}designation`);
            if (getDesignationReq.status === 200) {
                setDesignations(getDesignationReq.data.items);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getDesignationsHandler();
    }, []);

    const handleCheckboxUpdated = async (e, type) => {
        if (type === 0) {
            setIsLatest(e);
        } else if (type === 2) {
            setIsApproved(e);
        } else if (type === 3) {
            setIsRejected(e);
        } else if (type === 4) {
            setIsWithdrawn(e);
        }
    }

    function convertDate(inputFormat) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        var d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
    }

    const getRequests = async (currentPage = FIRST_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
        let from_date = convertDate(fromDate);
        let to_date = convertDate(toDate);
        const filter = `?mother_unit=${motherUnit}&destination_unit=${destinationUnit}&category=${category}&designation=${designation}&is_latest=${isLatest}&is_approved=${isApproved}&is_rejected=${isRejected}&is_withdrawn=${isWithdrawn}&page=${currentPage}&size=${pageSize}`;

        const req_url = `${API_URL}transfer-request/admin-request${filter}`;

        try {
            const getAdminTransferReqs = await axios.get(`${req_url}`, config);
            setRequests(getAdminTransferReqs.data.items);
            setTotalPages(getAdminTransferReqs.data.totalPages);
        } catch (error) {}
    }

    useEffect(() => {
        getRequests();
    }, [motherUnit, destinationUnit, category, designation, isLatest, isApproved, isRejected, isWithdrawn]);

    const exportToExcel = async () => {
        const filter = `?mother_unit=${motherUnit}&destination_unit=${destinationUnit}&category=${category}&designation=${designation}&is_latest=${isLatest}&is_approved=${isApproved}&is_rejected=${isRejected}`;

        const req_url = `${API_URL}transfer-request/export${filter}`;

        try {
            const exportAdminTransferReqs = await axios.get(`${req_url}`, config);
            downloadURL(`${API_URL}${exportAdminTransferReqs.data}`);
        } catch (error) {}
    }

    const downloadURL = (url) => {
        var hiddenIFrameID = 'hiddenDownloader',
            iframe = document.getElementById(hiddenIFrameID);
        if (iframe === null) {
            iframe = document.createElement('iframe');
            iframe.id = hiddenIFrameID;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        iframe.src = url;
    };

    const resetFilters = async () => {
        setCategory(0);
        setMotherUnit(0);
        setDestinationUnit(0);
        setDesignation(0);
        setIsLatest(false);
        setIsApproved(false);
        setIsRejected(false);
    }

    const showThisRequestDetails = async (request_id) => {
        setRequestId(request_id);

        try {
            const getThisReqDetails = await axios.get(`${API_URL}transfer-request/details/${request_id}`, config);
            if (getThisReqDetails.status === 200) {
                setRequestDetails(getThisReqDetails.data);
                setShowRequestDetails(true);
            } else {
                notifyError("Something Went Wrong");
            }
        } catch (error) {
            notifyError("Internal Server Error");
        }
    }

    const backToRequests = async () => {
        setShowRequestDetails(false);
        setRequestDetails({});
    }

    const approveThisRequest = (req_id) => {
        setApproveRequestId(req_id);
        setShowApproveRequestPopUp(true);
    }

    const rejectThisRequest = (req_id) => {
        setRejectRequestId(req_id);
        setShowRejectRequestPopUp(true);
    }

    const handleApproveSuccess = async (e) => {
        if (e == true) {
            setShowApproveRequestPopUp(false);
            getRequests();
        }
    }

    const handleRejectSuccess = async (e) => {
        if (e == true) {
            setShowRejectRequestPopUp(false);
            getRequests();
        }
    }

    return ( <
        >
        <
        div className = "adminDashboardPage" >
        <
        div className = "adminDashboardPageInner" >
        <
        div className = "adminDashboardPageStats" >
        <
        div className = "adminDashboardPageStatSingle blue" >
        <
        div className = "adminDashboardPageStatSingleInner" > {
            /* <div className="adminDashboardPageStatSingleIcon">
                                                <i className="fa-regular fa-address-card adminDashboardPageStatSingleIco"></i>
                                            </div> */
        } <
        div className = "adminDashboardPageStatSingleContent" >
        <
        div className = "adminDashboardPageStatSingleNumber" >
        <
        p className = "adminDashboardPageStatSingleNumberTxt" > {
            stats.total_users
        } < /p> <
        /div> <
        div className = "adminDashboardPageStatSingleLable" >
        <
        p className = "adminDashboardPageStatSingleLableTxt" > Registered Users < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        div className = "adminDashboardPageStatSingle yellow" >
        <
        div className = "adminDashboardPageStatSingleInner" > {
            /* <div className="adminDashboardPageStatSingleIcon">
                                                <i className="fa-regular fa-address-card adminDashboardPageStatSingleIco"></i>
                                            </div> */
        } <
        div className = "adminDashboardPageStatSingleContent" >
        <
        div className = "adminDashboardPageStatSingleNumber" >
        <
        p className = "adminDashboardPageStatSingleNumberTxt" > {
            stats.overall_requests
        } < /p> <
        /div> <
        div className = "adminDashboardPageStatSingleLable" >
        <
        p className = "adminDashboardPageStatSingleLableTxt" > Transfer Requests < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        div className = "adminDashboardPageStatSingle green" >
        <
        div className = "adminDashboardPageStatSingleInner" > {
            /* <div className="adminDashboardPageStatSingleIcon">
                                                <i className="fa-regular fa-address-card adminDashboardPageStatSingleIco"></i>
                                            </div> */
        } <
        div className = "adminDashboardPageStatSingleContent" >
        <
        div className = "adminDashboardPageStatSingleNumber" >
        <
        p className = "adminDashboardPageStatSingleNumberTxt" > {
            stats.approved_requests
        } < /p> <
        /div> <
        div className = "adminDashboardPageStatSingleLable" >
        <
        p className = "adminDashboardPageStatSingleLableTxt" > Approved Requests < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        div className = "adminDashboardPageStatSingle red" >
        <
        div className = "adminDashboardPageStatSingleInner" > {
            /* <div className="adminDashboardPageStatSingleIcon">
                                                <i className="fa-regular fa-address-card adminDashboardPageStatSingleIco"></i>
                                            </div> */
        } <
        div className = "adminDashboardPageStatSingleContent" >
        <
        div className = "adminDashboardPageStatSingleNumber" >
        <
        p className = "adminDashboardPageStatSingleNumberTxt" > {
            stats.rejected_requests
        } < /p> <
        /div> <
        div className = "adminDashboardPageStatSingleLable" >
        <
        p className = "adminDashboardPageStatSingleLableTxt" > Rejected Requests < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        /div> {
            !showRequestDetails
                ?
                <
                div className = "adminDashboardPageContent" >
                <
                div className = "adminDashboardPageContentFilters" >
                <
                div className = "adminDashboardPageContentFilterStep" >
                <
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
                    (e) => setMotherUnit(e.target.value)
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
                    (e) => setDestinationUnit(e.target.value)
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
                /div> <
                /div> <
                /div> {
                    /* <div className="adminDashboardPageContentFilterStep">
                                                        <div className="pageContentSectionFormStepHalf">
                                                            <div className="pageContentSectionFormStepLable">
                                                                <p className="pageContentSectionFormStepHalfLableTxt">from date</p>
                                                            </div>
                                                            <div className="pageContentSectionFormStepInput">
                                                                <DatePicker
                                                                    showYearDropdown
                                                                    yearDropdownItemNumber={25}
                                                                    scrollableYearDropdown
                                                                    minDate={new Date('03-04-2023')}
                                                                    maxDate={new Date()}
                                                                    selected={fromDate}
                                                                    onChange={(date) => setFromDate(date)}
                                                                    customInput={<CustomDatepickerInput />}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="pageContentSectionFormStepHalf">
                                                            <div className="pageContentSectionFormStepLable">
                                                                <p className="pageContentSectionFormStepHalfLableTxt">to date</p>
                                                            </div>
                                                            <div className="pageContentSectionFormStepInput">
                                                                <DatePicker
                                                                    showYearDropdown
                                                                    yearDropdownItemNumber={25}
                                                                    scrollableYearDropdown
                                                                    maxDate={new Date()}
                                                                    minDate={fromDate}
                                                                    selected={toDate}
                                                                    onChange={(date) => setToDate(date)}
                                                                    customInput={<CustomDatepickerInput />}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */
                } <
                div className = "adminDashboardPageContentFilterStep" >
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
                /div> <
                /div> <
                div className = "pageContentSectionFormStepHalf" >
                <
                div className = "pageContentSectionFormStepLable" >
                <
                p className = "pageContentSectionFormStepHalfLableTxt" > designation < /p> <
                /div> <
                div className = "pageContentSectionFormStepInput" >
                <
                select className = "pageContentSectionFormStepInputTxt selectInput"
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
                            option style = {
                                {
                                    textTransform: 'uppercase'
                                }
                            }
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
                /div> <
                /div> <
                /div>

                <
                div className = "adminDashboardPageContentFilterStep" >
                <
                div className = "pageContentSectionFormStepHalf" >
                <
                div className = "pageContentSectionFormStepSort" >
                <
                div className = "pageContentSectionFormStepLable" >
                <
                p className = "pageContentSectionFormStepHalfLableTxt" > sort by: < /p> <
                /div> <
                div className = "pageContentSectionFormStepInput" >
                <
                div className = "pageContentSectionFormStepInputRadio" >
                <
                div className = "pageContentSectionFormStepInputRadioMain" >
                <
                label className = "checkbox" >
                <
                input type = "checkbox"
            name = "latest"
            defaultChecked = {
                isLatest
            }
            value = {
                isLatest
            }
            onChange = {
                (e) => handleCheckboxUpdated(e.target.checked, 0)
            }
            /> <
            span className = "checkmark" > < /span>
            latest
                <
                /label> <
                /div> <
                div className = "pageContentSectionFormStepInputRadioMain" >
                <
                label className = "checkbox" >
                <
                input type = "checkbox"
            name = "approved_requests"
            defaultChecked = {
                isApproved
            }
            value = {
                isApproved
            }
            onChange = {
                (e) => handleCheckboxUpdated(e.target.checked, 2)
            }
            /> <
            span className = "checkmark" > < /span>
            Approved
                <
                /label> <
                /div> <
                div className = "pageContentSectionFormStepInputRadioMain" >
                <
                label className = "checkbox" >
                <
                input type = "checkbox"
            name = "rejected_requests"
            defaultChecked = {
                isRejected
            }
            value = {
                isRejected
            }
            onChange = {
                (e) => handleCheckboxUpdated(e.target.checked, 3)
            }
            /> <
            span className = "checkmark" > < /span>
            Rejected
                <
                /label> <
                /div> <
                div className = "pageContentSectionFormStepInputRadioMain" >
                <
                label className = "checkbox" >
                <
                input type = "checkbox"
            name = "withdrawn_requests"
            defaultChecked = {
                isWithdrawn
            }
            value = {
                isWithdrawn
            }
            onChange = {
                (e) => handleCheckboxUpdated(e.target.checked, 4)
            }
            /> <
            span className = "checkmark" > < /span>
            Withdrawn
                <
                /label> <
                /div> <
                /div> <
                /div> <
                /div> <
                /div> <
                /div>

                <
                div className = "adminDashboardPageContentFilterStep" >
                <
                div className = "adminDashboardPageContentFilterActions" >
                <
                div className = "adminDashboardPageContentFilterActionsInner" >
                <
                div className = "adminDashboardPageContentFilterActionSingle" >
                <
                button className = "adminDashboardPageContentFilterActionSingleButtonInput"
            type = {
                'button'
            }
            onClick = {
                    () => resetFilters()
                } > Reset Filters To Default < /button> <
                /div> <
                div className = "adminDashboardPageContentFilterActionSingle" >
                <
                button className = "adminDashboardPageContentFilterActionSingleButtonInput"
            type = {
                'button'
            }
            onClick = {
                    () => exportToExcel()
                } > Export To Excel < /button> <
                /div> <
                /div> <
                /div> <
                /div> <
                /div>


                <
                div className = "adminDashboardPageContentTableContainer" >
                <
                div className = "adminDashboardPageContentTable" >
                <
                div className = "adminDashboardPageContentTableHeading" >
                <
                div className = "adminDashboardPageContentTableHeadingSingle applicationID" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > appl.ID < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle name" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > name < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle from" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > from < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle from" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > to < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle category" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > category < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle category" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > applied on < /p> <
                /div> <
                div className = "adminDashboardPageContentTableHeadingSingle view" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > & nbsp; < /p> <
            /div> <
            div className = "adminDashboardPageContentTableHeadingSingle action" >
                <
                p className = "adminDashboardPageContentTableHeadingSingleLableTxt" > action < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentTableRowContainer" > {
                    requests.map((request) => {
                        return ( <
                            div className = "adminDashboardPageContentTableRow"
                            key = {
                                request.id
                            } >
                            <
                            div className = "adminDashboardPageContentTableRowSingle center applicationID" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request.application_id
                            } < /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle name" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request.name
                            } < /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle from" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request.mother_unit
                            } < /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle from" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request.destination_unit
                            } < /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle category" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request.category
                            } < /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle center category" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleLable" >
                            <
                            p className = "adminDashboardPageContentTableRowSingleLableTxt" > {
                                request ? .createdAt ? moment(new Date(request ? .createdAt)).format("DD/MM/YYYY") : < > NA < />
                            } <
                            /p> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle view" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleIcon" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleIconInner" >
                            <
                            i className = "fa-solid fa-eye tableRowItemIco"
                            onClick = {
                                () => showThisRequestDetails(request.id)
                            } > < /i> <
                            /div> <
                            /div> <
                            /div> <
                            div className = "adminDashboardPageContentTableRowSingle action" >
                            <
                            div className = "adminDashboardPageContentTableRowSingleAction" > {
                                request.is_approved ?
                                <
                                button type = "button"
                                style = {
                                    {
                                        width: '100%'
                                    }
                                }
                                className = "tableDisabledButton success"
                                disabled = {
                                    true
                                } > approved < /button> :
                                    <
                                    > < />
                            } {
                                request.is_rejected ?
                                    <
                                    button type = "button"
                                style = {
                                    {
                                        width: '100%'
                                    }
                                }
                                className = "tableDisabledButton danger"
                                disabled = {
                                        true
                                    } > rejected < /button>:
                                    <
                                    > < />
                            } {
                                request.is_withdrawn ?
                                    <
                                    button type = "button"
                                style = {
                                    {
                                        width: '100%'
                                    }
                                }
                                className = "tableDisabledButton danger"
                                disabled = {
                                        true
                                    } > withdrawn < /button>:
                                    <
                                    > < />
                            } {
                                request.is_approved != true && request.is_rejected != true && request.is_withdrawn != true ?
                                    <
                                    >
                                    <
                                    button type = "button"
                                style = {
                                    {
                                        width: 'calc(50% - 5px)',
                                        marginRight: '10px'
                                    }
                                }
                                className = "tableButton success"
                                onClick = {
                                        () => approveThisRequest(request.id)
                                    } > approve < /button> <
                                    button type = "button"
                                style = {
                                    {
                                        width: 'calc(50% - 5px)'
                                    }
                                }
                                className = "tableButton danger"
                                onClick = {
                                        () => rejectThisRequest(request.id)
                                    } > reject < /button> <
                                    />:
                                    <
                                    > < />
                            } <
                            /div> <
                            /div> <
                            /div>
                        )
                    })
                } <
                /div> <
                /div> <
                /div>

                <
                Pagination totalPages = {
                    totalPages
                }
            handlePageChange = {
                getRequests
            }
            setCurrentPage = {
                setCurrentPage
            }
            /> <
            /div>:
            <
            div className = "adminDashboardPageContent" >
                <
                div className = "adminDashboardPageContentHeading" >
                <
                p className = "adminDashboardPageContentHeadingTxt" > Request Details - {
                    requestDetails.application_id
                } < /p> <
                /div>

                <
                div className = "adminDashboardPageContentMain" >
                <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > name < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.name
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > phone number < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.phone_number
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > email ID < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.email_id
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > aadhaar no. < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.aadhaar_number
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > KGID < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.kgid
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > designation < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.designation
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > joining date < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.joining_date
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > date of appnt.for current rank < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.date_of_appointment_current_rank
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > current unit < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.current_unit
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > mother unit < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.mother_unit
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > destination unit < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.destination_unit
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > category < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.category
                } < /p> <
                /div> <
                /div> <
                div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepLable" >
                <
                p className = "adminDashboardPageContentStepLableTxt" > status < /p> <
                /div> <
                div className = "adminDashboardPageContentStepSeperator" >
                <
                p className = "adminDashboardPageContentStepSeperatorTxt" >: < /p> <
                /div> <
                div className = "adminDashboardPageContentStepDescription" >
                <
                p className = "adminDashboardPageContentStepDescriptionTxt" > {
                    requestDetails.status
                } < /p> <
                /div> <
                /div>

            {
                requestDetails.remarks != "" ?
                    <
                    div className = "adminDashboardPageContentStep" >
                    <
                    div className = "adminDashboardPageContentStepLable" >
                    <
                    p className = "adminDashboardPageContentStepLableTxt" > remarks < /p> <
                    /div> <
                    div className = "adminDashboardPageContentStepSeperator" >
                    <
                    p className = "adminDashboardPageContentStepSeperatorTxt" > : < /p> <
                    /div> <
                    div className = "adminDashboardPageContentStepDescription" >
                    <
                    p className = "adminDashboardPageContentStepDescriptionTxt" > {
                        requestDetails.remarks
                    } < /p> <
                    /div> <
                    /div>:
                    <
                    > < />
            } {
                requestDetails.attachment ?
                    <
                    div className = "adminDashboardPageContentStep" >
                    <
                    div className = "adminDashboardPageContentStepLable" >
                    <
                    p className = "adminDashboardPageContentStepLableTxt" > view attachment < /p> <
                    /div> <
                    div className = "adminDashboardPageContentStepSeperator" >
                    <
                    p className = "adminDashboardPageContentStepSeperatorTxt" > : < /p> <
                    /div> <
                    div className = "adminDashboardPageContentStepDescription" >
                    <
                    a className = "adminDashboardPageContentStepDescriptionTxt"
                href = {
                    requestDetails.attachment
                }
                target = "blank" > Click Here < /a> <
                    /div> <
                    /div>:
                    <
                    > < />
            }

            <
            div className = "adminDashboardPageContentStep" >
                <
                div className = "adminDashboardPageContentStepAction" >
                <
                button className = "adminDashboardPageContentFilterActionSingleButtonInput"
            onClick = {
                    backToRequests
                } > back to requests < /button> <
                /div> <
                /div> <
                /div> <
                /div>
        } <
        /div> <
        /div>

        {
            showApproveRequestPopUp
                ?
                <
                ApproveApplicationPopUp config = {
                    config
                }
            API_URL = {
                API_URL
            }
            requestId = {
                approveRequestId
            }
            hidePopUp = {
                () => setShowApproveRequestPopUp(false)
            }
            reportSuccess = {
                (e) => handleApproveSuccess(e)
            }
            />:
            <
            > < />
        }

        {
            showRejectRequestPopUp
                ?
                <
                RejectApplicationPopUp config = {
                    config
                }
            API_URL = {
                API_URL
            }
            requestId = {
                rejectRequestId
            }
            hidePopUp = {
                () => setShowRejectRequestPopUp(false)
            }
            reportSuccess = {
                (e) => handleRejectSuccess(e)
            }
            />:
            <
            > < />
        } <
        />

    )
}

export default AdminDashboard