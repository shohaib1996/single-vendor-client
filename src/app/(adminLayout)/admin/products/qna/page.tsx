"use client"

import React, { useState } from 'react';
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
import Link from 'next/link';

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

  if (isLoading) return <div className="p-4">Loading Q&A...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading Q&A.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Questions & Answers</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Asked By</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No questions found.</TableCell>
            </TableRow>
          ) : (
            questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.question}</TableCell>
                <TableCell>{q.userId}</TableCell>
                <TableCell>
                  <Button asChild variant="outline">
                    <Link href={`/products/${q.productId}`}>
                      Go to Product
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {q.answer ? (
                    <p
                      className="truncate max-w-xs cursor-pointer"
                      onClick={() => {
                        setFullAnswerContent(q.answer!.answer);
                        setShowFullAnswerDialog(true);
                      }}
                    >
                      {q.answer.answer}
                    </p>
                  ) : (
                    <span className="text-muted-foreground">No answer yet.</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!q.answer ? (
                    <Button size="sm" onClick={() => handleOpenAnswerDialog(q.id)} className="mr-2">
                      Answer
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleOpenAnswerDialog(q.id, q.answer)} className="mr-2">
                      Edit Answer
                    </Button>
                  )}
                  {q.answer && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleOpenConfirmDialog('answer', q.answer!.id)}
                      className="mr-2"
                      disabled={deleteAnswerLoading}
                    >
                      Delete Answer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleOpenConfirmDialog('question', q.id)}
                    disabled={deleteQuestionLoading}
                  >
                    Delete Question
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAnswer ? "Edit Answer" : "Answer Question"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="answer" className="text-right">
                Answer
              </Label>
              <Textarea
                id="answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="col-span-3"
                placeholder="Type your answer here."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnswerDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAnswerSubmit} disabled={createAnswerLoading || updateAnswerLoading}>
              {createAnswerLoading || updateAnswerLoading ? 'Submitting...' : (editingAnswer ? 'Update Answer' : 'Submit Answer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFullAnswerDialog} onOpenChange={setShowFullAnswerDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Full Answer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="break-words">{fullAnswerContent}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFullAnswerDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this {itemToDelete?.type}?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteAnswerLoading || deleteQuestionLoading}
            >
              {deleteAnswerLoading || deleteQuestionLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QnAPage;