"use client";

import { useState } from "react";
import { useGetAllProductsQuery } from "@/redux/api/product/productApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IProduct } from "@/types/product/product";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AllProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get("searchTerm") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(limit);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data: products, isLoading } = useGetAllProductsQuery({
    searchTerm: debouncedTerm,
    page: currentPage,
    limit: itemsPerPage,
  });
  // Math.ceil(
  //                     (meta?.total || 0) / (meta?.limit || 1)
  //                   )
  const productsData: IProduct[] = products?.data || [];
  const totalItems = products?.meta?.total || 0;
  const meta = products?.meta;
  const totalPages = Math.ceil((meta?.total || 0) / (meta?.limit || 1));

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="animate-pulse p-0">
              <CardContent className="p-0">
                <div className="w-full h-64 bg-muted rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {productsData.map((product: IProduct, index: number) => (
          <Card
            key={product.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-in slide-in-from-bottom-10 bg-card/50 backdrop-blur-sm border-border/50 p-0"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={
                      product.images[0] ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  />
                </Link>

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

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4" />
                  </button>
                  <Link href={`/products/${product.id}`}>
                    <button className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                </div>

                {/* Discount Timer */}
                {product.isDiscountActive && isDiscountValid(product) && (
                  <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Limited Time</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
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
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(getDisplayPrice(product))}
                  </span>
                  {getOriginalPrice(product) && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(getOriginalPrice(product)!)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        In Stock
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </div>
  );
};

export default AllProductsPage;
