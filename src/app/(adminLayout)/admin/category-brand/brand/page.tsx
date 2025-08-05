"use client";

import React, { useState } from "react";
import {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/redux/api/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { IBrand } from "@/types/product/product";
import { ICategory } from "@/types/category/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDebounced } from "@/redux/hooks/hooks";
import { PaginationControls } from "@/components/common/PaginationControls";

const BrandPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit as per meta data
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [brandData, setBrandData] = useState({
    name: "",
    categoryIds: [] as string[],
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounced({ searchQuery: searchTerm, delay: 600 });

  const query: Record<string, any> = { page, limit };
  if (debouncedSearchTerm) {
    query.searchTerm = debouncedSearchTerm;
  }

  const { data: brandResponse, isLoading, isError, refetch } = useGetAllBrandsQuery(query);
  const { data: categoryResponse } = useGetAllCategoriesQuery({});
  const [createBrand, { isLoading: createLoading }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation();

  const brands: IBrand[] = brandResponse?.data || [];
  const categories: ICategory[] = categoryResponse?.data || [];
  const paginationData = brandResponse?.meta;
  const totalPages = paginationData ? Math.ceil(paginationData.total / paginationData.limit) : 1;

  const handleAddClick = () => {
    setEditingBrand(null);
    setBrandData({ name: "", categoryIds: [] });
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (brand: IBrand) => {
    setEditingBrand(brand);
    setBrandData({
      name: brand.name,
      categoryIds: brand.categories.map((cat) => cat.id),
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!brandData.name.trim() || brandData.categoryIds.length === 0) {
      toast.error("Name and at least one category are required.");
      return;
    }

    try {
      if (editingBrand) {
        await updateBrand({
          id: editingBrand.id,
          data: brandData,
        }).unwrap();
        toast.success("Brand updated successfully!");
      } else {
        await createBrand(brandData).unwrap();
        toast.success("Brand added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save brand.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteBrand(itemToDelete).unwrap();
      toast.success("Brand deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete brand.");
    }
  };

  if (isLoading) return <div className="p-4">Loading brands...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading brands.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brand Management</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddClick}>Add Brand</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No brands found.
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  {brand.categories.map((cat) => cat.name).join(", ")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(brand)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(brand.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={brandData.name}
                onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categories" className="text-right">
                Categories
              </Label>
              <Select
                onValueChange={(value) => {
                  const selectedIds = brandData.categoryIds.includes(value)
                    ? brandData.categoryIds.filter((id) => id !== value)
                    : [...brandData.categoryIds, value];
                  setBrandData({ ...brandData, categoryIds: selectedIds });
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label>Selected Categories:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {brandData.categoryIds.map((id) => {
                  const category = categories.find((cat) => cat.id === id);
                  return (
                    <div
                      key={id}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm"
                    >
                      {category?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleFormSubmit} disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this brand?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandPage;