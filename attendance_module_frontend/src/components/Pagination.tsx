import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 2,
  onItemsPerPageChange,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  // Calculate item ranges for text (e.g. Showing 1 to 5 of 12 entries)
  const startRange = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Pages to show on either side of active page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Items range info */}
      {totalItems > 0 && (
        <div className="pagination-info">
          Showing <span className="pagination-highlight">{startRange}</span> to{' '}
          <span className="pagination-highlight">{endRange}</span> of{' '}
          <span className="pagination-highlight">{totalItems}</span> entries
        </div>
      )}

      <div className="pagination-controls">
        {/* Items per page selector */}
        {onItemsPerPageChange && (
          <div className="pagination-size-selector">
            <span className="selector-label">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="pagination-select"
              aria-label="Rows per page"
            >
              {[2, 5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="pagination-buttons">
          <button
            className="pagination-btn arrow-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FiChevronLeft />
          </button>

          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  &hellip;
                </span>
              );
            }

            const isPageActive = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                className={`pagination-btn num-btn ${isPageActive ? 'active' : ''}`}
                onClick={() => onPageChange(Number(page))}
                aria-label={`Page ${page}`}
                aria-current={isPageActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            className="pagination-btn arrow-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
