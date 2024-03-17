import ReactPaginate from "react-paginate";

const Pagination = ({
    totalPages,
    handlePageChange,
    setCurrentPage
}) => {
    const handlePageClick = (data) => {
        handlePageChange(data.selected + 1);
        setCurrentPage(data.selected + 1);
    }

    return ( <
        ReactPaginate className = "dashboardContentTablePagination"
        previousLabel = {
            "previous"
        }
        nextLabel = {
            "next"
        }
        breakLabel = {
            "..."
        }
        pageCount = {
            totalPages
        }
        marginPagesDisplayed = {
            2
        }
        pageRangeDisplayed = {
            3
        }
        onPageChange = {
            handlePageClick
        }
        containerClassName = {
            "pagination justify-content-center"
        }
        pageClassName = {
            "dashboardContentTablePaginationPageSingle"
        }
        pageLinkClassName = {
            "dashboardContentTablePaginationPageSingleTxt"
        }
        previousClassName = {
            "dashboardContentTablePaginationAction"
        }
        previousLinkClassName = {
            "dashboardContentTablePaginationActionTxt"
        }
        nextClassName = {
            "dashboardContentTablePaginationAction"
        }
        nextLinkClassName = {
            "dashboardContentTablePaginationActionTxt"
        }
        breakClassName = {
            "dashboardContentTablePaginationAction"
        }
        breakLinkClassName = {
            "dashboardContentTablePaginationActionTxt"
        }
        activeClassName = {
            "active"
        }
        />
    );
}

export default Pagination;