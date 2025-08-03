"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FilterOption {
  id: string
  categoryId: string
  name: string
  type: string
  options: string[]
  unit: string | null
}

interface FilterRangeProps {
  filterOption: FilterOption
  value: { min?: number; max?: number }
  onChange: (value: { min?: number; max?: number }) => void
}

const FilterRange = ({ filterOption, value, onChange }: FilterRangeProps) => {
  const [localMin, setLocalMin] = useState<string>(value.min?.toString() || "")
  const [localMax, setLocalMax] = useState<string>(value.max?.toString() || "")

  useEffect(() => {
    setLocalMin(value.min?.toString() || "")
    setLocalMax(value.max?.toString() || "")
  }, [value])

  const handleApply = () => {
    const min = localMin ? Number.parseFloat(localMin) : undefined
    const max = localMax ? Number.parseFloat(localMax) : undefined

    if (min !== undefined && max !== undefined && min > max) {
      return // Don't apply if min > max
    }

    onChange({ min, max })
  }

  const handleClear = () => {
    setLocalMin("")
    setLocalMax("")
    onChange({})
  }

  const hasValue = value.min !== undefined || value.max !== undefined

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">{filterOption.name}</h4>
        {hasValue && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-auto p-1 text-xs">
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`${filterOption.id}-min`} className="text-xs text-muted-foreground">
            Min {filterOption.unit && `(${filterOption.unit})`}
          </Label>
          <Input
            id={`${filterOption.id}-min`}
            type="number"
            placeholder="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor={`${filterOption.id}-max`} className="text-xs text-muted-foreground">
            Max {filterOption.unit && `(${filterOption.unit})`}
          </Label>
          <Input
            id={`${filterOption.id}-max`}
            type="number"
            placeholder="1000"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="h-8"
          />
        </div>
      </div>

      <Button size="sm" className="w-full" onClick={handleApply} disabled={!localMin && !localMax}>
        Apply Range
      </Button>

      {hasValue && (
        <div className="text-xs text-muted-foreground text-center">
          {value.min !== undefined && value.max !== undefined
            ? `${filterOption.unit || ""}${value.min} - ${filterOption.unit || ""}${value.max}`
            : value.min !== undefined
              ? `From ${filterOption.unit || ""}${value.min}`
              : `Up to ${filterOption.unit || ""}${value.max}`}
        </div>
      )}
    </div>
  )
}

export default FilterRange
