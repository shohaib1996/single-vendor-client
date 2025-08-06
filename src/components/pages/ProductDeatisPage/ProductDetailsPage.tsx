"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  X,
  Loader,
} from "lucide-react";
import { useGetSingleProductQuery } from "@/redux/api/product/productApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCreateCartMutation } from "@/redux/api/cart/cartApi";
import { useCreateWishlistMutation } from "@/redux/api/wishlist/wishlistApi";
import ReviewForm from "./ReviewForm";
import QuestionForm from "./QuestionForm";
import { ISingleProduct } from "@/types";

interface ProductDetailsPageProps {
  id: string;
}

const ProductDetailsPage = ({ id }: ProductDetailsPageProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: productData, isLoading, error } = useGetSingleProductQuery(id);
  const { user } = useAppSelector((state) => state.auth || { user: null });
  const [createCart, { isLoading: cartLoading }] = useCreateCartMutation();
  const [addToWishlist, { isLoading: wishlistLoading }] =
    useCreateWishlistMutation();

  const product: ISingleProduct = productData?.data;

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < (product?.stock || 0)) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (user?.role === "ADMIN") {
      toast.error("You are admin not allowed to add.");
      return;
    }

    if (!product?.stock || product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const cartData = {
        userId: user.id,
        productId: product.id,
        quantity,
      };
      await createCart(cartData).unwrap();
      toast.success(`Added ${quantity} ${product.name} to cart`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    if (user?.role === "ADMIN") {
      toast.error("You are admin not allowed to add.");
      return;
    }
    const wilshListData = {
      productId: product.id,
    };

    try {
      const res = await addToWishlist(wilshListData).unwrap();
      toast.success(`Added ${product?.name} to wishlist`);
      return;
    } catch (error: any) {
      toast.error(`Duplicate item`)
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const isDiscountValid = (product: any) => {
    if (!product?.isDiscountActive || !product?.discountValidUntil)
      return false;
    return new Date(product.discountValidUntil) > new Date();
  };

  const getDisplayPrice = (product: any) => {
    if (
      product?.isDiscountActive &&
      product?.discountedPrice &&
      isDiscountValid(product)
    ) {
      return product.discountedPrice;
    }
    return product?.price || 0;
  };

  const getOriginalPrice = (product: any) => {
    if (
      product?.isDiscountActive &&
      product?.discountedPrice &&
      isDiscountValid(product)
    ) {
      return product.price;
    }
    return null;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted animate-pulse rounded-lg h-[300px] lg:h-[400px] w-full"></div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
            <div className="h-12 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <X className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRating = product.reviews?.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    : 0;

  // Sort reviews and questions by createdAt in descending order (latest first)
  const sortedReviews =
    product.reviews
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

  const sortedQuestions =
    product.questions
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-lg border h-[300px] lg:h-[400px]">
            <Image
              src={
                product.images[selectedImage] ||
                "/placeholder.svg?height=400&width=400"
              }
              alt={product.name}
              fill
              className="object-fill"
              priority
            />
            {product.isDiscountActive && isDiscountValid(product) && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    selectedImage === index ? "border-primary" : "border-muted"
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.brand && (
                <Badge variant="outline">{product.brand.name}</Badge>
              )}
              {product.category && (
                <Badge variant="secondary">{product.category.name}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(getDisplayPrice(product))}
              </span>
              {getOriginalPrice(product) && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(getOriginalPrice(product)!)}
                </span>
              )}
            </div>
            {product.isDiscountActive && isDiscountValid(product) && (
              <p className="text-sm text-green-600">
                You save {formatPrice(product.price - getDisplayPrice(product))}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {cartLoading && (
                <Button size="lg" className="flex-1 h-12">
                  {" "}
                  <ShoppingCart className="mr-2 h-5 w-5" /> Adding to Cart ...
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 h-12 ${cartLoading && "hidden"}`}
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className="h-12 px-6 bg-transparent"
                size="lg"
              >
                {wishlistLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="questions">
            Q&A ({product.questions?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex justify-between py-2 border-b"
                    >
                      <span className="font-medium">{spec.key}:</span>
                      <span className="text-muted-foreground">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No specifications available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Add Review Form */}
            <ReviewForm productId={id} />

            <Separator />

            {/* Reviews List */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Customer Reviews</h3>
              {sortedReviews.length > 0 ? (
                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {getInitials("User")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to review this product!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <div className="space-y-6">
            {/* Ask Question Form */}
            <QuestionForm productId={id} />

            <Separator />

            {/* Questions List */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Questions & Answers</h3>
              {sortedQuestions.length > 0 ? (
                <div className="space-y-4">
                  {sortedQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* Question */}
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                Q
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{question.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Asked on{" "}
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Answer */}
                          {question.answer ? (
                            <div className="flex items-start gap-4 ml-12">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-semibold text-sm">
                                  A
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-muted-foreground">
                                  {question.answer.answer}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Answered on{" "}
                                  {new Date(
                                    question.answer.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="ml-12 text-sm text-muted-foreground">
                              No answer yet
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Questions Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to ask a question about this product!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailsPage;
