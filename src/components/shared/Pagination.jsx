import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  canPreviousPage,
  canNextPage,
  onPrevious,
  onNext
}) => {
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="btn btn-sm btn-outline"
        disabled={canPreviousPage !== undefined ? !canPreviousPage : currentPage === 1}
        onClick={handlePrevious}
      >
        Previous
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="btn btn-sm btn-outline"
        disabled={canNextPage !== undefined ? !canNextPage : currentPage === totalPages}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
};

export default Pagination;
