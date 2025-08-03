"use client"

import { useState } from "react"
import { useGetAllProductsQuery } from "@/redux/api/product/productApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Grid, List } from 'lucide-react'
import ProductGrid from "./ProductGrid"
import FilterSidebar from "./FilterSidebar"
import FilterSlider from "./FilterSlider"
import CategoryBreadcrumb from "./CategoryBreadcrumb"

interface CategoryWiseProductProps {
  slug: string
}

export interface FilterState {
  [key: string]: string[] | { min?: number; max?: number }
}

const CategoryWiseProduct = ({ slug }: CategoryWiseProductProps) => {
  // Extract category slug and ID from the slug parameter
  const [categorySlug, categoryId] = slug.split("~")

  // State management
  const [filters, setFilters] = useState<FilterState>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Build query parameters
  const buildQueryParams = () => {
    const params: Record<string, any> = {
      categoryId,
    }

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params[key.toLowerCase()] = value.join(",")
      } else if (typeof value === "object" && value !== null) {
        const rangeValue = value as { min?: number; max?: number }
        // Convert "Price Range" to "priceRange" maintaining camelCase
        const filterKey = key
          .split(" ")
          .map((word, index) => 
            index === 0 
              ? word.toLowerCase() 
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("")
        
        if (rangeValue.min !== undefined) params[`${filterKey}Min`] = rangeValue.min
        if (rangeValue.max !== undefined) params[`${filterKey}Max`] = rangeValue.max
      }
    })

    return params
  }

  // Fetch products with filters
  const { data: productsData, isLoading, error } = useGetAllProductsQuery(buildQueryParams())
  const products = productsData?.data || []

  const handleFilterChange = (filterName: string, value: string[] | { min?: number; max?: number }) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <CategoryBreadcrumb categorySlug={categorySlug} />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold capitalize">{categorySlug.replace(/-/g, " ")} Products</h1>
              <p className="text-muted-foreground mt-1">
                {isLoading ? "Loading..." : `${products.length} products found`}
              </p>
            </div>

            {/* View Mode Toggle - Desktop Only */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getActiveFilterCount() > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? "s" : ""} applied
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <FilterSidebar
                categoryId={categoryId}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={products} isLoading={isLoading} error={error} viewMode={viewMode} />
          </div>
        </div>

        {/* Mobile Filter Slider */}
        <FilterSlider
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categoryId={categoryId}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      </div>
    </div>
  )
}

export default CategoryWiseProduct
