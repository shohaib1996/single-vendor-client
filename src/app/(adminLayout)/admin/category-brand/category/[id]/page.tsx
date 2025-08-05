"use client";
import React, { useState } from "react";
import {
  useGetSingleCategoryQuery,
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
import { useParams } from "next/navigation";

const SubCategoryPage = () => {
  const { id: categoryId } = useParams();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<ICategory | null>(
    null
  );
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    data: categoryDataResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSingleCategoryQuery(categoryId);

  const [createCategory, { isLoading: createLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  const category: ICategory = categoryDataResponse?.data;
  const subCategories: ICategory[] = category?.children || [];

  const handleAddClick = () => {
    setEditingSubCategory(null);
    setSubCategoryData({ name: "", slug: "", icon: "", description: "" });
    setIconFile(null);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (subCategory: ICategory) => {
    setEditingSubCategory(subCategory);
    setSubCategoryData({
      name: subCategory.name,
      slug: subCategory.slug,
      icon: subCategory.icon ?? "",
      description: subCategory.description ?? "",
    });
    setIconFile(null);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (
      !subCategoryData.name.trim() ||
      !subCategoryData.slug.trim() ||
      !subCategoryData.description.trim()
    ) {
      toast.error("Name, Slug, and Description are required.");
      return;
    }

    let iconUrl = subCategoryData.icon;
    if (iconFile) {
      const toastId = toast.loading("Uploading icon...");
      try {
        const uploadedUrls = await uploadFiles([iconFile]);
        if (uploadedUrls && uploadedUrls.length > 0) {
          iconUrl = uploadedUrls[0];
          toast.success("Icon uploaded successfully!", { id: toastId });
        } else {
          toast.error("Failed to upload icon.", { id: toastId });
          return;
        }
      } catch (error) {
        toast.error("Error uploading icon.", { id: toastId });
        console.error("Upload error:", error);
        return;
      }
    } else if (!iconUrl.trim()) {
      toast.error("Icon URL or file is required.");
      return;
    }

    const payload = { ...subCategoryData, icon: iconUrl };

    try {
      if (editingSubCategory) {
        await updateCategory({
          id: editingSubCategory.id,
          data: payload,
        }).unwrap();
        toast.success("Sub-category updated successfully!");
      } else {
        await createCategory({ ...payload, parentId: categoryId }).unwrap();
        toast.success("Sub-category added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save sub-category.");
      console.error("Sub-category save error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCategory(itemToDelete).unwrap();
      toast.success("Sub-category deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete sub-category.");
      console.error("Sub-category delete error:", error);
    }
  };

  if (isLoading) return <div className="p-4">Loading sub-categories...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading sub-categories.</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Sub-categories for {`"${category?.name}"`}
        </h1>
        <Button onClick={handleAddClick}>Add Sub-category</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No sub-categories found.
              </TableCell>
            </TableRow>
          ) : (
            subCategories.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.id}</TableCell>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.slug}</TableCell>
                <TableCell>
                  {sub.icon && (
                    <Image
                      src={sub.icon}
                      alt={sub.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate overflow-hidden whitespace-nowrap">
                  {sub.description}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(sub)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(sub.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubCategory ? "Edit Sub-category" : "Add New Sub-category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={subCategoryData.name}
                onChange={(e) =>
                  setSubCategoryData({ ...subCategoryData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Sub-category Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={subCategoryData.slug}
                onChange={(e) =>
                  setSubCategoryData({ ...subCategoryData, slug: e.target.value })
                }
                className="col-span-3"
                placeholder="sub-category-slug"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={subCategoryData.description}
                onChange={(e) =>
                  setSubCategoryData({
                    ...subCategoryData,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Sub-category Description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="iconUrl" className="text-right">
                Icon URL
              </Label>
              <Input
                id="iconUrl"
                value={subCategoryData.icon}
                onChange={(e) =>
                  setSubCategoryData({ ...subCategoryData, icon: e.target.value })
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
            {subCategoryData.icon && !iconFile && (
              <div className="col-span-4 flex justify-center">
                <Image
                  src={subCategoryData.icon}
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
                : editingSubCategory
                ? "Update Sub-category"
                : "Add Sub-category"}
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
            Are you sure you want to delete this sub-category? This action cannot be
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

export default SubCategoryPage;