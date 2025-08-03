"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Star } from "lucide-react"
import { useAppSelector } from "@/redux/hooks/hooks"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCreateReviewMutation } from "@/redux/api/review/reviewApi"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500, "Comment must be less than 500 characters"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const [createReview, {isLoading}] = useCreateReviewMutation()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const watchedRating = form.watch("rating")

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      toast.error("Please login to submit a review")
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        rating: data.rating,
        comment: data.comment,
        userId: user.id,
        productId: productId,
      }

      await createReview(reviewData).unwrap()

      toast.success("Review submitted successfully!")
      form.reset()
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please login to write a review</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => field.onChange(i + 1)}
                          onMouseEnter={() => setHoveredRating(i + 1)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={cn(
                              "h-6 w-6 transition-colors",
                              (hoveredRating || watchedRating) > i
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {watchedRating > 0 && `${watchedRating} star${watchedRating > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ReviewForm
