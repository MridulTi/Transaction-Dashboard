import React from 'react';

const DefaultPagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
            >
                Previous
            </button>
            <span className="px-4">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded bg-gray-200 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default DefaultPagination;
