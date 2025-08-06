"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis logic
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; // Reduced for better mobile fit

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-ful px-2">
      {/* Left: Items per page selector */}
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Show
        </span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onLimitChange?.(parseInt(value))}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          per page
        </span>
      </div>

      {/* Middle: Items info */}
      <div className="text-sm text-muted-foreground text-center md:flex-1">
        {totalItems > 0 ? (
          <>
            Showing{" "}
            <span className="font-medium text-foreground">
              {startItem.toLocaleString()}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {endItem.toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {totalItems.toLocaleString()}
            </span>{" "}
            results
          </>
        ) : (
          "No results found"
        )}
      </div>

      {/* Right: Pagination buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <Pagination>
            <PaginationContent className="flex flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-accent"
                  }
                  aria-disabled={currentPage <= 1}
                />
              </PaginationItem>
              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page as number);
                      }}
                      isActive={page === currentPage}
                      className={`cursor-pointer text-sm px-3 py-1 ${
                        page === currentPage
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-accent"
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:bg-accent"
                  }
                  aria-disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}