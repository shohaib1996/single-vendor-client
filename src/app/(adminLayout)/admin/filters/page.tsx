"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, easeOut } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Loader2, PlusCircle, Search, Trash2, Edit, Filter, AlertCircle, Plus, X, Settings } from 'lucide-react';
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
import { CopyButton } from "@/components/common/CopyButton";
import { PaginationControls } from "@/components/common/PaginationControls";

// Update formSchema to include 'TEXT' type
const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
  filters: z.array(z.object({
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(["DROPDOWN", "RANGE", "TEXT"], { message: "Type is required" }),
    unit: z.string().optional(),
    options: z.string().optional(),
  })).min(1, { message: "At least one filter is required" }),
});

const FiltersManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query: Record<string, any> = {};
  const searchTerm = searchParams.get("searchTerm") || "";
  const categoryId = searchParams.get("categoryId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  query.limit = limit;
  query.page = page;

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

  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const categories = categoriesData?.data;

  const [createFilterOption] = useCreateFilterOptionMutation();
  const [updateFilterOption] = useUpdateFilterOptionMutation();
  const [deleteFilterOption] = useDeleteFilterOptionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<IFilterOption | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      filters: [
        {
          name: "",
          type: "DROPDOWN",
          unit: "",
          options: "",
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "filters",
  });

  React.useEffect(() => {
    if (editingFilter) {
      form.reset({
        categoryId: editingFilter.categoryId,
        filters: [{
          name: editingFilter.name,
          type: editingFilter.type,
          unit: editingFilter.unit || "",
          options: editingFilter.options?.join(", ") || "",
        }],
      });
    } else {
      form.reset({
        categoryId: "",
        filters: [{
          name: "",
          type: "DROPDOWN",
          unit: "",
          options: "",
        }],
      });
    }
  }, [editingFilter, form]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingFilter) {
        setLoadingItemId(editingFilter.id);
        const payload = {
          categoryId: values.categoryId,
          name: values.filters[0].name,
          type: values.filters[0].type,
          unit: values.filters[0].type === "RANGE" ? values.filters[0].unit : undefined,
          options: values.filters[0].type === "DROPDOWN"
            ? values.filters[0].options?.split(",").map((s) => s.trim())
            : undefined,
        };
        await updateFilterOption({
          id: editingFilter.id,
          data: payload,
        }).unwrap();
        toast.success("Filter option updated successfully!");
      } else {
        const payloads = values.filters.map(filter => ({
          categoryId: values.categoryId,
          name: filter.name,
          type: filter.type,
          unit: filter.type === "RANGE" ? filter.unit : undefined,
          options: filter.type === "DROPDOWN"
            ? filter.options?.split(",").map((s) => s.trim())
            : undefined,
        }));
        await createFilterOption(payloads).unwrap();
        toast.success(`${payloads.length} filter option(s) created successfully!`);
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
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleCategorySearch = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      newSearchParams.set('categoryId', value);
    } else {
      newSearchParams.delete('categoryId');
    }
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("limit", newLimit.toString());
    newSearchParams.set("page", "1");
    router.push(`?${newSearchParams.toString()}`);
  };

  const totalPages = Math.ceil(meta?.total / meta?.limit) || 1;

  if (isLoading) {
    return <FiltersSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load filter options. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Filter Options Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create and manage filter options for your product categories
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Filters
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {meta?.total || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/20">
                  <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Page
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {page}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-950/20">
                  <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Items Per Page
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {limit}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-950/20">
                  <PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or slug..."
                      className="pl-8 w-full sm:w-[300px]"
                      defaultValue={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Select
                    onValueChange={handleCategorySearch}
                    defaultValue={categoryId || "all"}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
                      className="w-full sm:w-auto"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Filter Option
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <span>
                          {editingFilter ? "Edit Filter Option" : "Add New Filter Options"}
                        </span>
                      </DialogTitle>
                      <DialogDescription>
                        {editingFilter
                          ? "Edit the details of the filter option."
                          : "Fill in the details to add new filter options. You can add multiple filters for the same category."}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {/* Category Selection */}
                        <Card className="border-dashed">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center space-x-2">
                              <Settings className="h-4 w-4" />
                              <span>Category Selection</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
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
                          </CardContent>
                        </Card>

                        {/* Filter Options */}
                        <Card className="border-dashed">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4" />
                                <span>Filter Options</span>
                              </div>
                              {!editingFilter && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => append({
                                    name: "",
                                    type: "DROPDOWN",
                                    unit: "",
                                    options: "",
                                  })}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add More
                                </Button>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-4">
                            {fields.map((field: any, index: number) => (
                              <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                                {!editingFilter && fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0"
                                    onClick={() => remove(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`filters.${index}.name`}
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
                                    name={`filters.${index}.type`}
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
                                </div>

                                {form.watch(`filters.${index}.type`) === "RANGE" && (
                                  <FormField
                                    control={form.control}
                                    name={`filters.${index}.unit`}
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

                                {form.watch(`filters.${index}.type`) === "DROPDOWN" && (
                                  <FormField
                                    control={form.control}
                                    name={`filters.${index}.options`}
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
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <DialogFooter>
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {editingFilter ? "Save Changes" : `Create Filter${fields.length > 1 ? 's' : ''}`}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
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
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Filter className="h-12 w-12 text-muted-foreground/50" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">
                                No filter options found
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Create your first filter option to get started
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterOptions?.map((filterOption: IFilterOption, index: number) => (
                        <motion.tr
                          key={filterOption.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {filterOption.id.slice(0, 8)}...
                              </Badge>
                              <CopyButton text={filterOption.id} />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {filterOption.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {filterOption.category?.name || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                filterOption.type === "DROPDOWN" ? "default" :
                                filterOption.type === "RANGE" ? "secondary" : "outline"
                              }
                            >
                              {filterOption.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {filterOption.unit ? (
                              <Badge variant="outline">{filterOption.unit}</Badge>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {filterOption.options && filterOption.options.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {filterOption.options.slice(0, 2).map((option, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {option}
                                  </Badge>
                                ))}
                                {filterOption.options.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{filterOption.options.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
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
                                    <AlertDialogTitle className="flex items-center space-x-2">
                                      <AlertCircle className="h-5 w-5 text-destructive" />
                                      <span>Are you absolutely sure?</span>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the filter option &quot;{filterOption.name}&quot; and remove its data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(filterOption.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete Filter
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {filterOptions && filterOptions.length > 0 && (
          <motion.div variants={itemVariants}>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={meta?.total || 0}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const FiltersSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-[200px]" />
              </div>
              <Skeleton className="h-10 w-48" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-40" />
                  <div className="flex space-x-2 ml-auto">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FiltersManagement;
