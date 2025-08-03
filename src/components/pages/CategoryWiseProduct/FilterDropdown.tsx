"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, X } from "lucide-react"

interface FilterOption {
  id: string
  categoryId: string
  name: string
  type: string
  options: string[]
  unit: string | null
}

interface FilterDropdownProps {
  filterOption: FilterOption
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
}

const FilterDropdown = ({ filterOption, selectedValues, onSelectionChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedValues, option])
    } else {
      onSelectionChange(selectedValues.filter((value) => value !== option))
    }
  }

  const removeSelection = (option: string) => {
    onSelectionChange(selectedValues.filter((value) => value !== option))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{filterOption.name}</h4>
        {selectedValues.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto p-1 text-xs">
            Clear
          </Button>
        )}
      </div>

      {/* Selected Values */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <Badge key={value} variant="secondary" className="text-xs">
              {value}
              <button onClick={() => removeSelection(value)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            <span className="text-sm">
              {selectedValues.length > 0 ? `${selectedValues.length} selected` : `Select ${filterOption.name}`}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto">
          <div className="p-2 space-y-2">
            {filterOption.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterOption.id}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                />
                <label
                  htmlFor={`${filterOption.id}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default FilterDropdown
