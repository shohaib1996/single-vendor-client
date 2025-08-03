"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetFilterOptionsQuery } from "@/redux/api/filterOption/filterOptionApi";
import { Loader2, Filter } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import FilterRange from "./FilterRange";
import type { FilterState } from "./CategoryWiseProduct";


interface FilterSidebarProps {
  categoryId: string;
  filters: FilterState;
  onFilterChange: (
    filterName: string,
    value: string[] | { min?: number; max?: number }
  ) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  categoryId,
  filters,
  onFilterChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const { data: filterOptionsData, isLoading } = useGetFilterOptionsQuery({
    categoryId,
  });
  const filterOptions = filterOptionsData?.data || [];

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      } else if (typeof value === "object" && value !== null) {
        const rangeValue = value as { min?: number; max?: number };
        return (
          count +
          (rangeValue.min !== undefined || rangeValue.max !== undefined ? 1 : 0)
        );
      }
      return count;
    }, 0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {getActiveFilterCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {filterOptions.map((filterOption: any) => (
          <div key={filterOption.id}>
            {filterOption.type === "DROPDOWN" ? (
              <FilterDropdown
                filterOption={filterOption}
                selectedValues={(filters[filterOption.name] as string[]) || []}
                onSelectionChange={(values) =>
                  onFilterChange(filterOption.name, values)
                }
              />
            ) : filterOption.type === "RANGE" ? (
              <FilterRange
                filterOption={filterOption}
                value={
                  (filters[filterOption.name] as {
                    min?: number;
                    max?: number;
                  }) || {}
                }
                onChange={(value) => onFilterChange(filterOption.name, value)}
              />
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
