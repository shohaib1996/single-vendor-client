"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounced } from "@/redux/hooks/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateFilterOptionMutation,
  useDeleteFilterOptionMutation,
  useGetFilterOptionsQuery,
  useUpdateFilterOptionMutation,
} from "@/redux/api/filterOption/filterOptionApi";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { ICategory, IFilterOption } from "@/types/category/category";
import { Loader2, PlusCircle, Search, Trash2, Edit } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Update formSchema to include 'TEXT' type
const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(["DROPDOWN", "RANGE", "TEXT"], { message: "Type is required" }),
  unit: z.string().optional(),
  options: z.string().optional(),
});

const FiltersManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query: Record<string, any> = {};
  const searchTerm = searchParams.get("searchTerm") || ""; // Default to empty string
  const categoryId = searchParams.get("categoryId");

  query.limit = 10;
  query.page = 1;

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }
  if (categoryId) {
    query.categoryId = categoryId;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const { data, isLoading, isError } = useGetFilterOptionsQuery(
    debouncedSearchTerm ? { ...query, searchTerm: debouncedSearchTerm } : query
  );


  const filterOptions = data?.data;
  const meta = data?.meta;

  console.log(filterOptions);

  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const categories = categoriesData?.data;

  const [createFilterOption] = useCreateFilterOptionMutation();
  const [updateFilterOption] = useUpdateFilterOptionMutation();
  const [deleteFilterOption] = useDeleteFilterOptionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<IFilterOption | null>(
    null
  );
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      type: "DROPDOWN",
      unit: "",
      options: "",
    },
  });

  React.useEffect(() => {
    if (editingFilter) {
      form.reset({
        categoryId: editingFilter.categoryId,
        name: editingFilter.name,
        type: editingFilter.type,
        unit: editingFilter.unit || "",
        options: editingFilter.options?.join(", ") || "",
      });
    } else {
      form.reset({
        categoryId: "",
        name: "",
        type: "DROPDOWN",
        unit: "",
        options: "",
      });
    }
  }, [editingFilter, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        categoryId: values.categoryId,
        name: values.name,
        type: values.type,
        unit: values.type === "RANGE" ? values.unit : undefined,
        options:
          values.type === "DROPDOWN"
            ? values.options?.split(",").map((s) => s.trim())
            : undefined,
      };

      if (editingFilter) {
        setLoadingItemId(editingFilter.id);
        await updateFilterOption({
          id: editingFilter.id,
          data: payload,
        }).unwrap();
        toast.success("Filter option updated successfully!");
      } else {
        // Always send payload as an array
        await createFilterOption([payload]).unwrap();
        toast.success("Filter option created successfully!");
      }
      setIsModalOpen(false);
      setEditingFilter(null);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoadingItemId(id);
      await deleteFilterOption(id).unwrap();
      toast.success("Filter option deleted successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      newSearchParams.set("searchTerm", e.target.value);
    } else {
      newSearchParams.delete("searchTerm");
    }
    router.push(`?${newSearchParams.toString()}`);
  };

const handleCategorySearch = (value: string) => {
  const newSearchParams = new URLSearchParams(searchParams.toString());
  if (value && value !== 'all') {
    newSearchParams.set('categoryId', value);
  } else {
    newSearchParams.delete('categoryId');
  }
  router.push(`?${newSearchParams.toString()}`);
};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load filter options. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Filter Options Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or slug..."
              className="pl-8 w-[300px]"
              defaultValue={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select
            onValueChange={handleCategorySearch}
            defaultValue={categoryId || "all"}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>{" "}
              {/* Changed value from "" to "all" */}
              {categories?.map((category: ICategory) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingFilter(null);
                setIsModalOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Filter Option
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingFilter ? "Edit Filter Option" : "Add New Filter Option"}
              </DialogTitle>
              <DialogDescription>
                {editingFilter
                  ? "Edit the details of the filter option."
                  : "Fill in the details to add a new filter option."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category: ICategory) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Filter name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                          <SelectItem value="RANGE">Range</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("type") === "RANGE" && (
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit (e.g., kg, cm, $, etc.)</FormLabel>
                        <FormControl>
                          <Input placeholder="Unit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("type") === "DROPDOWN" && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Option1, Option2, Option3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {editingFilter ? "Save Changes" : "Create Filter Option"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Options</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterOptions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No filter options found.
                </TableCell>
              </TableRow>
            ) : (
              filterOptions?.map((filterOption: IFilterOption) => (
                <TableRow key={filterOption.id}>
                  <TableCell className="font-medium">
                    {filterOption.name}
                  </TableCell>
                  <TableCell>{filterOption.category?.name || "N/A"}</TableCell>
                  <TableCell>{filterOption.type}</TableCell>
                  <TableCell>{filterOption.unit || "N/A"}</TableCell>
                  <TableCell>
                    {filterOption.options && filterOption.options.length > 0
                      ? filterOption.options.join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingFilter(filterOption);
                          setIsModalOpen(true);
                        }}
                        disabled={loadingItemId === filterOption.id}
                      >
                        {loadingItemId === filterOption.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={loadingItemId === filterOption.id}
                          >
                            {loadingItemId === filterOption.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the filter option and remove
                              its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(filterOption.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FiltersManagement;
