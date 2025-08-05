import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllCategoriesQuery } from '@/redux/api/category/categoryApi';
import { useGetAllBrandsQuery } from '@/redux/api/brand/brandApi';
import { ICategory, IBrand, IProduct } from '@/types';
import { uploadFiles } from '@/lib/uploadFile';
import { toast } from 'sonner';

interface ProductFormProps {
  initialData?: Omit<IProduct, 'createdAt' | 'updatedAt' | 'discountedPrice'> & { discountValidUntil?: Date | string; };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [price, setPrice] = React.useState(initialData?.price || 0);
  const [stock, setStock] = React.useState(initialData?.stock || 0);
  const [images, setImages] = React.useState(initialData?.images.join(',') || '');
  const [selectedFiles, setSelectedFiles] = React.useState<FileList | null>(null);
  const [featured, setFeatured] = React.useState(initialData?.featured || false);
  const [isDiscountActive, setIsDiscountActive] = React.useState(initialData?.isDiscountActive || false);
  const [discountPercentage, setDiscountPercentage] = React.useState(initialData?.discountPercentage || 0);
  const [discountValidUntil, setDiscountValidUntil] = React.useState(() => {
    if (initialData?.discountValidUntil instanceof Date) {
      return initialData.discountValidUntil.toISOString().split('T')[0];
    }
    return initialData?.discountValidUntil || '';
  });
  const [categoryId, setCategoryId] = React.useState(initialData?.categoryId || '');
  const [brandId, setBrandId] = React.useState(initialData?.brandId || '');

  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useGetAllCategoriesQuery({});
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError } = useGetAllBrandsQuery({});

  const categories: ICategory[] = categoriesData?.data || [];
  const brands: IBrand[] = brandsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrls: string[] = [];
    if (selectedFiles && selectedFiles.length > 0) {
      try {
        uploadedImageUrls = await uploadFiles(Array.from(selectedFiles));
        toast.success("Images uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload images.");
        console.error("Upload error:", error);
        // Optionally, prevent form submission if image upload is critical
        return;
      }
    }

    const existingImageUrls = images.split(',').map(img => img.trim()).filter(img => img !== '');
    const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

    onSubmit({
      name,
      description,
      price,
      stock,
      images: finalImageUrls,
      featured,
      isDiscountActive,
      discountPercentage: isDiscountActive ? discountPercentage : undefined,
      discountValidUntil: isDiscountActive ? discountValidUntil : undefined,
      categoryId,
      brandId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description" required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} placeholder="Enter product price" required />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} placeholder="Enter product stock" required />
      </div>
      <div>
        <Label htmlFor="images">Existing Images (comma-separated URLs)</Label>
        <Textarea id="images" value={images} onChange={(e) => setImages(e.target.value)} placeholder="Enter image URLs separated by commas" />
      </div>
      <div>
        <Label htmlFor="new-images">Upload New Images</Label>
        <Input
          id="new-images"
          type="file"
          multiple
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="isDiscountActive" checked={isDiscountActive} onCheckedChange={setIsDiscountActive} />
        <Label htmlFor="isDiscountActive">Active Discount</Label>
      </div>

      {isDiscountActive && (
        <>
          <div>
            <Label htmlFor="discountPercentage">Discount Percentage</Label>
            <Input id="discountPercentage" type="number" step="0.01" value={discountPercentage} onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))} placeholder="Enter discount percentage" />
          </div>
          <div>
            <Label htmlFor="discountValidUntil">Discount Valid Until</Label>
            <Input id="discountValidUntil" type="date" value={discountValidUntil} onChange={(e) => setDiscountValidUntil(e.target.value)} />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="categoryId">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoriesLoading && <SelectItem value="" disabled>Loading categories...</SelectItem>}
            {categoriesError && <SelectItem value="" disabled>Error loading categories</SelectItem>}
            {!categoriesLoading && !categoriesError && categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="brandId">Brand</Label>
        <Select value={brandId} onValueChange={setBrandId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brandsLoading && <SelectItem value="" disabled>Loading brands...</SelectItem>}
            {brandsError && <SelectItem value="" disabled>Error loading brands</SelectItem>}
            {!brandsLoading && !brandsError && brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Product' : 'Add Product'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
