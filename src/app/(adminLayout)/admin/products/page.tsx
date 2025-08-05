"use client"

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ProductForm from '@/components/pages/ProductManagement/ProductForm';
import { useCreateProductMutation, useGetAllProductsQuery, useUpdateProductMutation, useDeleteProductMutation } from '@/redux/api/product/productApi';

import { toast } from 'sonner';
import { IProduct, ICategory, IBrand } from '@/types';
import { useGetAllCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetAllBrandsQuery } from '@/redux/api/brand/brandApi';
import { PaginationControls } from '@/components/common/PaginationControls';

const AllProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query: any = {
    page: String(page),
    limit: String(limit),
  };

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery(query);
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const { data: brandsData } = useGetAllBrandsQuery({});

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];
  const meta = data?.meta;

  const categories: ICategory[] = categoriesData?.data || [];
  const brands: IBrand[] = brandsData?.data || [];

  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'N/A';
  };

  const getBrandName = (id: string) => {
    const brand = brands.find(b => b.id === id);
    return brand ? brand.name : 'N/A';
  };

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const handleAddProduct = async (newProductData: any) => {
    try {
      await createProduct(newProductData).unwrap();
      toast.success("Product created successfully!");
      setIsAddProductDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product.");
    }
  };

  const handleUpdateProduct = async (updatedProductData: any) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: updatedProductData }).unwrap();
        toast.success("Product updated successfully!");
        setIsEditProductDialogOpen(false);
        setEditingProduct(null);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product.");
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product: IProduct) => product.id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsEditProductDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div className="p-4">Loading products...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading products.</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddProductDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No products found.</TableCell>
            </TableRow>
          ) : (
            products.map((product: IProduct) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getCategoryName(product.categoryId || '')}</TableCell>
                <TableCell>{getBrandName(product.brandId || '')}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.featured ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product.id)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center mt-4">
        <PaginationControls
          currentPage={page}
          totalPages={Math.ceil((meta?.total || 0) / (meta?.limit || 1))}
          onPageChange={handlePageChange}
        />
      </div>

      {editingProduct && (
        <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleUpdateProduct}
               onCancel={() => setIsEditProductDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AllProductsPage;