import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => (
  <div className="flex items-center justify-center mt-4 space-x-2">
    <button onClick={onPrevious} disabled={currentPage === 1} className="btn btn-primary">
      <span className="sr-only">Previous</span>
      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
    </button>
    <span className="text-center">
      Page {currentPage} of {totalPages}
    </span>
    <button onClick={onNext} disabled={currentPage === totalPages} className="btn btn-primary">
      <span className="sr-only">Next</span>
      <ChevronRight className="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
);

export default Pagination;
