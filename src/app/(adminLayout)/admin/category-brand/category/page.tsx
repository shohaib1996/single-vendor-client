"use client";

import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/category/categoryApi";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import Image from "next/image";
import { uploadFiles } from "@/lib/uploadFile";
import Link from "next/link";

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    query.searchTerm = searchTerm; // Assuming API supports general search term
  }
  query.parentId = null; // Fetch only top-level categories for this page

  const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery(query);
  const [createCategory, { isLoading: createLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  const categories: ICategory[] = data?.data || [];

  // Fetch all categories to determine subcategory counts
  const { data: allCategoriesData } = useGetAllCategoriesQuery({});
//   const allCategories: ICategory[] = allCategoriesData?.data?.data || [];

  const handleAddClick = () => {
    setEditingCategory(null);
    setCategoryData({ name: "", slug: "", icon: "", description: "" });
    setIconFile(null);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (category: ICategory) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      slug: category.slug,
      icon: category.icon ?? "",
      description: category.description ?? "",
    });

    setIconFile(null); // Reset file input on edit
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (
      !categoryData.name.trim() ||
      !categoryData.slug.trim() ||
      !categoryData.description.trim()
    ) {
      toast.error("Name, Slug, and Description are required.");
      return;
    }

    let iconUrl = categoryData.icon;
    if (iconFile) {
      try {
        const uploadedUrls = await uploadFiles([iconFile]);
        if (uploadedUrls && uploadedUrls.length > 0) {
          iconUrl = uploadedUrls[0];
          toast.success("Icon uploaded successfully!");
          setCategoryData((prev) => ({ ...prev, icon: iconUrl }));
        } else {
          toast.error("Failed to upload icon.");
          return;
        }
      } catch (error) {
        toast.error("Error uploading icon.");
        console.error("Upload error:", error);
        return;
      }
    } else if (!iconUrl.trim()) {
      toast.error("Icon URL or file is required.");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: { ...categoryData, icon: iconUrl },
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory({ ...categoryData, icon: iconUrl }).unwrap();
        toast.success("Category added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save category.");
      console.error("Category save error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCategory(itemToDelete).unwrap();
      toast.success("Category deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category.");
      console.error("Category delete error:", error);
    }
  };

  if (isLoading) return <div className="p-4">Loading categories...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading categories.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <div className="flex justify-end items-center mb-4">
        <Button onClick={handleAddClick}>Add Category</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Subcategories</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  {category.icon && (
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate overflow-hidden whitespace-nowrap">
                  {category.description}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/category-brand/category/${category.id}`}>
                    <Button variant="link">
                      View {`(${category?.children.length})`}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(category)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      /> */}

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Category Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={categoryData.slug}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, slug: e.target.value })
                }
                className="col-span-3"
                placeholder="category-slug"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={categoryData.description}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Category Description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="iconUrl" className="text-right">
                Icon URL
              </Label>
              <Input
                id="iconUrl"
                value={categoryData.icon}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, icon: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter icon URL or upload file"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="iconFile" className="text-right">
                Upload Icon
              </Label>
              <Input
                id="iconFile"
                type="file"
                onChange={(e) =>
                  setIconFile(e.target.files ? e.target.files[0] : null)
                }
                className="col-span-3"
              />
            </div>
            {categoryData.icon && !iconFile && (
              <div className="col-span-4 flex justify-center">
                <Image
                  src={categoryData.icon}
                  alt="Current Icon"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading
                ? "Saving..."
                : editingCategory
                ? "Update Category"
                : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryPage;
