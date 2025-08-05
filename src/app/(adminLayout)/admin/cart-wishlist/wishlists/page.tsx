"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetWishlistQuery } from "@/redux/api/wishlist/wishlistApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IWishlistItem } from "@/types/wishlist/wishlist";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Skeleton } from "@/components/ui/skeleton";

const WishlistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetWishlistQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const wishlists = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wishlists</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <Input
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : isError ? (
        <div>Error loading wishlists.</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wishlist ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Product Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlists.map((wishlist: IWishlistItem) => (
                <TableRow key={wishlist.id}>
                  <TableCell className="truncate max-w-[100px]">{wishlist.id}</TableCell>
                  <TableCell>{wishlist.user.name}</TableCell>
                  <TableCell>{wishlist.user.email}</TableCell>
                  <TableCell>{wishlist.product.name}</TableCell>
                  <TableCell>${wishlist.product.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistsPage;