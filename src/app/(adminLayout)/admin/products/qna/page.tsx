"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetAllProductQuestionsQuery, useDeleteProductQuestionMutation } from '@/redux/api/productQuestion/productQuestionApi';
import { useCreateProductAnswerMutation, useUpdateProductAnswerMutation, useDeleteProductAnswerMutation } from '@/redux/api/productAnswer/productAnswerApi';
import { IProductQuestion, IProductAnswer } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/redux/hooks/hooks';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { HelpCircle, MessageSquare, User, Package, Edit3, Trash2, Plus, Eye, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const QnAPage = () => {
  const { data, isLoading, isError, refetch } = useGetAllProductQuestionsQuery({});
  const { user } = useAppSelector((state) => state.auth);
  const [createAnswer, { isLoading: createAnswerLoading }] = useCreateProductAnswerMutation();
  const [updateAnswer, { isLoading: updateAnswerLoading }] = useUpdateProductAnswerMutation();
  const [deleteAnswer, { isLoading: deleteAnswerLoading }] = useDeleteProductAnswerMutation();
  const [deleteQuestion, { isLoading: deleteQuestionLoading }] = useDeleteProductQuestionMutation();

  const questions: (IProductQuestion & { answer?: IProductAnswer })[] = data?.data || [];

  const [answerText, setAnswerText] = useState('');
  const [editingAnswer, setEditingAnswer] = useState<IProductAnswer | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [showFullAnswerDialog, setShowFullAnswerDialog] = useState(false);
  const [fullAnswerContent, setFullAnswerContent] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'question' | 'answer'; id: string } | null>(null);

  const handleOpenAnswerDialog = (questionId: string, existingAnswer?: IProductAnswer) => {
    setCurrentQuestionId(questionId);
    if (existingAnswer) {
      setEditingAnswer(existingAnswer);
      setAnswerText(existingAnswer.answer);
    } else {
      setEditingAnswer(null);
      setAnswerText('');
    }
    setIsAnswerDialogOpen(true);
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestionId || !answerText.trim()) {
      toast.error("Answer text cannot be empty.");
      return;
    }

    try {
      if (editingAnswer) {
        await updateAnswer({ id: editingAnswer.id, data: { answer: answerText } }).unwrap();
        toast.success("Answer updated successfully!");
      } else {
        await createAnswer({ questionId: currentQuestionId, answer: answerText, adminId: user?.id }).unwrap();
        toast.success("Answer submitted successfully!");
      }
      setIsAnswerDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit answer.");
      console.error("Answer submission error:", error);
    }
  };

  const handleOpenConfirmDialog = (type: 'question' | 'answer', id: string) => {
    setItemToDelete({ type, id });
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'answer') {
        await deleteAnswer(itemToDelete.id).unwrap();
        toast.success("Answer deleted successfully!");
      } else {
        await deleteQuestion(itemToDelete.id).unwrap();
        toast.success("Question deleted successfully!");
      }
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to delete ${itemToDelete.type}.`);
      console.error(`Delete ${itemToDelete.type} error:`, error);
    }
  };

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
      },
    },
  };

  // Calculate stats
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.answer).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  if (isLoading) return <QnAPageSkeleton />;
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load Q&A</h3>
            <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container  mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Product Q&A Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage customer questions and provide helpful answers to improve customer experience
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Answered</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{answeredQuestions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{unansweredQuestions}</p>
                  {unansweredQuestions > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 py-0">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="flex items-center space-x-2 pt-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className=''>Customer Questions & Answers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Question</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Answer Status</TableHead>
                      <TableHead className="font-semibold">Answer</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <HelpCircle className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                              <h3 className="font-semibold text-lg">No questions found</h3>
                              <p className="text-muted-foreground">Customer questions will appear here when they ask about products</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      questions.map((q, index) => (
                        <motion.tr
                          key={q.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-medium max-w-xs">
                            <div className="flex items-start space-x-2">
                              <HelpCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <p className="line-clamp-3">{q.question}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[100px]">{q.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button asChild variant="outline" size="sm" className="h-8">
                              <Link href={`/products/${q.productId}`} className="flex items-center space-x-1">
                                <Package className="h-3 w-3" />
                                <span>View Product</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          </TableCell>
                          <TableCell>
                            {q.answer ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Answered
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            {q.answer ? (
                              <div className="space-y-2">
                                <p
                                  className="truncate max-w-[150px] cursor-pointer text-sm bg-muted/50 p-2 rounded hover:bg-muted transition-colors"
                                  onClick={() => {
                                    setFullAnswerContent(q.answer!.answer);
                                    setShowFullAnswerDialog(true);
                                  }}
                                >
                                  {q.answer.answer}
                                </p>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  <span>Click to view full answer</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">No answer yet</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {!q.answer ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleOpenAnswerDialog(q.id)}
                                  className="h-8"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Answer
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleOpenAnswerDialog(q.id, q.answer)}
                                  className="h-8"
                                >
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                              {q.answer && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenConfirmDialog('answer', q.answer!.id)}
                                  disabled={deleteAnswerLoading}
                                  className="h-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenConfirmDialog('question', q.id)}
                                disabled={deleteQuestionLoading}
                                className="h-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
      </motion.div>

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>{editingAnswer ? "Edit Answer" : "Answer Question"}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-base font-semibold">
                Your Answer
              </Label>
              <Textarea
                id="answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Type your detailed answer here. Be helpful and informative to assist the customer."
              />
              <p className="text-xs text-muted-foreground">
                Provide a clear and helpful answer to assist the customer with their question.
              </p>
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setIsAnswerDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAnswerSubmit} 
              disabled={createAnswerLoading || updateAnswerLoading || !answerText.trim()}
              className="min-w-[120px]"
            >
              {createAnswerLoading || updateAnswerLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Submitting...</span>
                </div>
              ) : (
                editingAnswer ? 'Update Answer' : 'Submit Answer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Answer Dialog */}
      <Dialog open={showFullAnswerDialog} onOpenChange={setShowFullAnswerDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Full Answer</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap leading-relaxed">{fullAnswerContent}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFullAnswerDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Confirm Deletion</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteAnswerLoading || deleteQuestionLoading}
              className="min-w-[100px]"
            >
              {deleteAnswerLoading || deleteQuestionLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Loading skeleton component
const QnAPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="flex space-x-2 ml-auto">
                    <Skeleton className="h-8 w-16" />
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

export default QnAPage;
