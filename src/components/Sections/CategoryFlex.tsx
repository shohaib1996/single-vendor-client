"use client";

import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { ICategory } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CategoryFlex = () => {
  const { data: categories, isLoading } = useGetAllCategoriesQuery({});
  const categoryList: ICategory[] = categories?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto py-4 bg-background">
        <nav className="flex flex-wrap items-center justify-center">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="px-3 py-2 rounded-md animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="hidden sm:hidden md:hidden lg:hidden xl:flex">
      <div className="container mx-auto py-4 bg-background">
        <nav className="flex flex-wrap items-center justify-center">
          {categoryList.map((category) => (
            <div key={category.id} className="relative group">
              {/* Main Category Link */}
              <Link
                href={`/category/${category.slug}~${category.id}`}
                className={cn(
                  "text-sm font-medium text-gray-700 hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary",
                  "px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-gray-700"
                )}
              >
                {category.name}
              </Link>

              {/* Subcategory and Brand Dropdown */}
              {(category.children.length > 0 || category.brands.length > 0) && (
                <div
                  className={cn(
                    "absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg",
                    "dark:bg-gray-800 dark:border-gray-700",
                    "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200",
                    "z-[1000] pointer-events-none group-hover:pointer-events-auto"
                  )}
                >
                  <ul className="py-2">
                    {/* Subcategories Section */}
                    {category.children.length > 0 && (
                      <>
                        <li className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Subcategories
                        </li>
                        {category.children.map((subcategory) => (
                          <li key={subcategory.id}>
                            <Link
                              href={`/category/${subcategory.slug}~${subcategory.id}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-muted hover:text-primary transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary"
                            >
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                        <li className="border-t border-gray-200 dark:border-gray-700 my-2" />
                      </>
                    )}

                    {/* Brands Section (up to 10) */}
                    {category.brands.length > 0 && (
                      <>
                        <li className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Brands
                        </li>
                        {category.brands.slice(0, 10).map((brand) => (
                          <li key={brand.id}>
                            <Link
                              href={`/products?searchTerm=${encodeURIComponent(brand.name)}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-muted hover:text-accent transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-accent"
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryFlex;