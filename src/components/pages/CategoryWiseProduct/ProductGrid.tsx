"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { IProduct } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: IProduct[];
  isLoading: boolean;
  error: any;
  viewMode: "grid" | "list";
}

const ProductGrid = ({
  products,
  isLoading,
  error,
  viewMode,
}: ProductGridProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const isDiscountValid = (product: IProduct) => {
    if (!product.isDiscountActive || !product.discountValidUntil) return false;
    return new Date(product.discountValidUntil) > new Date();
  };

  const getDisplayPrice = (product: IProduct) => {
    if (
      product.isDiscountActive &&
      product.discountedPrice &&
      isDiscountValid(product)
    ) {
      return product.discountedPrice;
    }
    return product.price;
  };

  const getOriginalPrice = (product: IProduct) => {
    if (
      product.isDiscountActive &&
      product.discountedPrice &&
      isDiscountValid(product)
    ) {
      return product.price;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}
    >
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <Card
            key={product.id}
            className={cn(
              "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden p-0",
              viewMode === "list" && "flex flex-row"
            )}
          >
            <CardContent
              className={cn("p-0", viewMode === "list" && "flex w-full")}
            >
              {/* Product Image */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  viewMode === "grid"
                    ? "aspect-square"
                    : "w-48 h-48 flex-shrink-0"
                )}
              >
                <Image
                  src={
                    product.images[0] || "/placeholder.svg?height=300&width=300"
                  }
                  alt={product.name}
                  fill
                  className="object-fill transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs">
                      Featured
                    </Badge>
                  )}
                  {product.isDiscountActive && isDiscountValid(product) && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                {/* Stock Status */}
                <div className="absolute top-3 right-3">
                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Only {product.stock} left
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div
                className={cn(
                  "p-4",
                  viewMode === "list" && "flex-1 flex flex-col justify-between"
                )}
              >
                <div>
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between mb-2">
                    {product.brand && (
                      <Badge variant="outline" className="text-xs">
                        {product.brand.name}
                      </Badge>
                    )}
                    {product.category && (
                      <span className="text-xs text-muted-foreground">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors truncate cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description - List view only */}
                  {viewMode === "list" && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div>
                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(getDisplayPrice(product))}
                    </span>
                    {getOriginalPrice(product) && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(getOriginalPrice(product)!)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {product.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          In Stock
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
