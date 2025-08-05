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
import { useGetCartQuery } from "@/redux/api/cart/cartApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { ICart } from "@/types/cart/cart";
import { PaginationControls } from "@/components/common/PaginationControls";


const CartItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetCartQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const carts = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
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
          Loading...
        </div>
      ) : isError ? (
        <div>Error loading cart items.</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cart ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Total Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart: ICart) => (
                <TableRow key={cart.id}>
                  <TableCell className="truncate max-w-[100px]">{cart.id}</TableCell>
                  <TableCell>{cart.user.name}</TableCell>
                  <TableCell>{cart.user.email}</TableCell>
                  <TableCell>{cart.items.length}</TableCell>
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

export default CartItemsPage;