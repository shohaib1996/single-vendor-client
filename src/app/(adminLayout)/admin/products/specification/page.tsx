"use client";

import React, { useState } from "react";
import {
  useCreateProductSpecificationMutation,
  useUpdateProductSpecificationMutation,
  useDeleteProductSpecificationMutation,
  useGetProductSpecificationsQuery,
} from "@/redux/api/productSpecification/productSpecificationApi";
import { IProductSpecification } from "@/types";
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
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Eye } from "lucide-react";
import Link from "next/link";

const SpecificationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingSpecification, setEditingSpecification] =
    useState<IProductSpecification | null>(null);
  const [specList, setSpecList] = useState<
    { productId: string; key: string; value: string }[]
  >([{ productId: "", key: "", value: "" }]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    query.productId = searchTerm;
  }

  const { data, isLoading, isError, refetch } =
    useGetProductSpecificationsQuery(query);
  const [createSpecification, { isLoading: createLoading }] =
    useCreateProductSpecificationMutation();
  const [updateSpecification, { isLoading: updateLoading }] =
    useUpdateProductSpecificationMutation();
  const [deleteSpecification, { isLoading: deleteLoading }] =
    useDeleteProductSpecificationMutation();

  const specifications: IProductSpecification[] = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;
  const totalItems = data?.data?.meta?.total || 0;

  const handleAddClick = () => {
    setEditingSpecification(null);
    setSpecList([{ productId: "", key: "", value: "" }]);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (spec: IProductSpecification) => {
    setEditingSpecification(spec);
    setSpecList([
      { productId: spec.productId, key: spec.key, value: spec.value },
    ]);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleAddMore = () => {
    setSpecList([
      ...specList,
      { productId: specList[0].productId, key: "", value: "" },
    ]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecList(specList.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof (typeof specList)[0],
    value: string
  ) => {
    const updatedSpecList = [...specList];
    updatedSpecList[index] = { ...updatedSpecList[index], [field]: value };
    setSpecList(updatedSpecList);
  };

const handleFormSubmit = async () => {
  // Validate all fields
  const isValid = specList.every(
    (spec) => spec.productId.trim() && spec.key.trim() && spec.value.trim()
  );
  if (!isValid) {
    toast.error("All fields are required for each specification.");
    return;
  }

  try {
    if (editingSpecification) {
      // For editing, only handle the first specification
      await updateSpecification({
        id: editingSpecification.id,
        data: specList[0], // Update still uses single object
      }).unwrap();
      toast.success("Specification updated successfully!");
    } else {
      // For creation, always send array of specifications
      await createSpecification(specList).unwrap();
      toast.success(
        `Specification${specList.length > 1 ? "s" : ""} added successfully!`
      );
    }
    setIsFormDialogOpen(false);
    refetch();
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to save specification(s).");
    console.error("Specification save error:", error);
  }
};

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteSpecification(itemToDelete).unwrap();
      toast.success("Specification deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete specification.");
      console.error("Specification delete error:", error);
    }
  };

  if (isLoading) return <div className="p-4">Loading specifications...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">Error loading specifications.</div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Specifications</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by Product ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddClick}>Add Specification</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No specifications found.
              </TableCell>
            </TableRow>
          ) : (
            specifications.map((spec) => (
              <TableRow key={spec.id}>
                <TableCell className="font-medium">{spec.id}</TableCell>
                <TableCell>{spec.productId}</TableCell>
                <TableCell>{spec.key}</TableCell>
                <TableCell>{spec.value}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/products/${spec.productId}`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      <Eye />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(spec)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteClick(spec.id)}
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
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {editingSpecification
                ? "Edit Specification"
                : "Add New Specification"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {specList.map((spec, index) => (
              <div key={index} className="space-y-4">
                {index > 0 && <hr className="border-gray-200" />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`productId-${index}`} className="text-right">
                    Product ID
                  </Label>
                  <Input
                    id={`productId-${index}`}
                    value={spec.productId}
                    onChange={(e) =>
                      handleInputChange(index, "productId", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="Enter Product ID"
                    disabled={!!editingSpecification || index > 0} // Fix: Ensure boolean value
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`key-${index}`} className="text-right">
                    Key
                  </Label>
                  <Input
                    id={`key-${index}`}
                    value={spec.key}
                    onChange={(e) =>
                      handleInputChange(index, "key", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="e.g., Color, Material"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`value-${index}`} className="text-right">
                    Value
                  </Label>
                  <Input
                    id={`value-${index}`}
                    value={spec.value}
                    onChange={(e) =>
                      handleInputChange(index, "value", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="e.g., Red, Cotton"
                  />
                </div>
                {specList.length > 1 && !editingSpecification && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveSpec(index)}
                    className="ml-auto"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {!editingSpecification && (
              <Button
                variant="outline"
                onClick={handleAddMore}
                className="mt-2"
              >
                More
              </Button>
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
                : editingSpecification
                ? "Update Specification"
                : "Add Specification"}
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
            Are you sure you want to delete this specification? This action
            cannot be undone.
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

export default SpecificationPage;
