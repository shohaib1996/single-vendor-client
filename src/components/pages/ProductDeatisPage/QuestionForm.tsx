"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppSelector } from "@/redux/hooks/hooks"
import { toast } from "sonner"
import { useCreateProductQuestionMutation } from "@/redux/api/productQuestion/productQuestionApi"

const questionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must be less than 500 characters"),
})

type QuestionFormValues = z.infer<typeof questionSchema>

interface QuestionFormProps {
  productId: string
}

const QuestionForm = ({ productId }: QuestionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const [createProductQuestion] = useCreateProductQuestionMutation()

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
    },
  })

  const onSubmit = async (data: QuestionFormValues) => {
    if (!user) {
      toast.error("Please login to ask a question")
      return
    }

    setIsSubmitting(true)

    try {
      const questionData = {
        question: data.question,
        userId: user.id,
        productId: productId,
      }

      await createProductQuestion(questionData).unwrap()

      toast.success("Question submitted successfully!")
      form.reset()
    } catch (error) {
      console.error("Failed to submit question:", error)
      toast.error("Failed to submit question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please login to ask a question</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ask anything about this product..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Ask Question"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default QuestionForm
