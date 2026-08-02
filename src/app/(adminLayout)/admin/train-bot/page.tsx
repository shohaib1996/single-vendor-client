"use client";

import { useRef, useState } from "react";
import { GraduationCap, Trash2, FileText, Type, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import {
  useDeleteTrainingDocumentMutation,
  useGetTrainingDocumentsQuery,
  useSubmitTrainingTextMutation,
  useUploadTrainingFileMutation,
} from "@/redux/api/train/trainApi";

export default function TrainBotPage() {
  const { data: documents, isLoading } = useGetTrainingDocumentsQuery();
  const [submitText, { isLoading: isSubmittingText }] = useSubmitTrainingTextMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadTrainingFileMutation();
  const [deleteDocument] = useDeleteTrainingDocumentMutation();

  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitText = async () => {
    if (!textTitle.trim() || !textContent.trim()) return;
    try {
      const result = await submitText({ title: textTitle.trim(), content: textContent.trim() }).unwrap();
      toast.success(`Trained on "${textTitle.trim()}" (${result.chunks_indexed} chunks indexed)`);
      setTextTitle("");
      setTextContent("");
    } catch {
      toast.error("Failed to submit training text. Is the AI service running?");
    }
  };

  const handleUploadFile = async () => {
    if (!uploadTitle.trim() || !selectedFile) return;
    try {
      const result = await uploadFile({ title: uploadTitle.trim(), file: selectedFile }).unwrap();
      toast.success(`Trained on "${uploadTitle.trim()}" (${result.chunks_indexed} chunks indexed)`);
      setUploadTitle("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Failed to upload document. Is the AI service running?");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteDocument(id).unwrap();
      toast.success(`Removed "${title}" from the knowledge base`);
    } catch {
      toast.error("Failed to delete. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">Train Bot</h1>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">
        Add store policies, FAQs, or other knowledge here — the customer chatbot searches this content
        to answer questions about returns, shipping, and how things work.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text">
            <TabsList>
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-1" /> Paste text
              </TabsTrigger>
              <TabsTrigger value="upload">
                <FileText className="h-4 w-4 mr-1" /> Upload document
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-3 mt-4">
              <Input
                placeholder="Title (e.g. Return Policy)"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
              />
              <Textarea
                placeholder="Paste the policy or FAQ content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
              />
              <Button
                onClick={handleSubmitText}
                disabled={isSubmittingText || !textTitle.trim() || !textContent.trim()}
              >
                {isSubmittingText && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Train bot on this text
              </Button>
            </TabsContent>

            <TabsContent value="upload" className="space-y-3 mt-4">
              <Input
                placeholder="Title (e.g. Warranty Terms)"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">Supported: .pdf, .txt, .md</p>
              <Button
                onClick={handleUploadFile}
                disabled={isUploading || !uploadTitle.trim() || !selectedFile}
              >
                {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Train bot on this document
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trained content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !documents || documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nothing trained yet — add your first policy or FAQ above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.source_type === "file" ? doc.original_filename ?? "file" : "text"}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.chunk_count}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(doc.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove &quot;{doc.title}&quot;?</AlertDialogTitle>
                            <AlertDialogDescription>
                              The bot will no longer be able to use this content to answer questions.
                              This can&apos;t be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(doc.id, doc.title)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
