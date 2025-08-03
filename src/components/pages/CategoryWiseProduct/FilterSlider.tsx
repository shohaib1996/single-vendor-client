"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetFilterOptionsQuery } from "@/redux/api/filterOption/filterOptionApi"
import { X, Filter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import FilterDropdown from "./FilterDropdown"
import FilterRange from "./FilterRange"
import type { FilterState } from "./CategoryWiseProduct"

interface FilterSliderProps {
  isOpen: boolean
  onClose: () => void
  categoryId: string
  filters: FilterState
  onFilterChange: (filterName: string, value: string[] | { min?: number; max?: number }) => void
  onClearFilters: () => void
}

const FilterSlider = ({ isOpen, onClose, categoryId, filters, onFilterChange, onClearFilters }: FilterSliderProps) => {
  const { data: filterOptionsData, isLoading } = useGetFilterOptionsQuery({ categoryId })
  const filterOptions = filterOptionsData?.data || []

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length
      } else if (typeof value === "object" && value !== null) {
        const rangeValue = value as { min?: number; max?: number }
        return count + (rangeValue.min !== undefined || rangeValue.max !== undefined ? 1 : 0)
      }
      return count
    }, 0)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Slider */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-full sm:w-80 bg-background border-r shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {filterOptions.map((filterOption: any) => (
                  <div key={filterOption.id}>
                    {filterOption.type === "DROPDOWN" ? (
                      <FilterDropdown
                        filterOption={filterOption}
                        selectedValues={(filters[filterOption.name] as string[]) || []}
                        onSelectionChange={(values) => onFilterChange(filterOption.name, values)}
                      />
                    ) : filterOption.type === "RANGE" ? (
                      <FilterRange
                        filterOption={filterOption}
                        value={(filters[filterOption.name] as { min?: number; max?: number }) || {}}
                        onChange={(value) => onFilterChange(filterOption.name, value)}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
            {getActiveFilterCount() > 0 && (
              <Button variant="outline" className="w-full bg-transparent" onClick={onClearFilters}>
                Clear All Filters
              </Button>
            )}
            <Button className="w-full" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSlider
