"use client"

import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

interface CategoryBreadcrumbProps {
  categorySlug: string
}

const CategoryBreadcrumb = ({ categorySlug }: CategoryBreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="capitalize text-foreground font-medium">{categorySlug.replace(/-/g, " ")}</span>
    </nav>
  )
}

export default CategoryBreadcrumb
