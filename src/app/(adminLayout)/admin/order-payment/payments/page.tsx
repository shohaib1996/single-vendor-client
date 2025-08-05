"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllPaymentQuery, useUpdatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IPayment, PaymentStatus } from "@/types/order/order";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetAllPaymentQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const [updatePayment, { isLoading: updateLoading }] = useUpdatePaymentMutation();

  const handleStatusChange = async (paymentId: string, status: PaymentStatus) => {
    setUpdatingId(paymentId);
    try {
      await updatePayment({ id: paymentId, data: { status } }).unwrap();
      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const payments = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <Input
            placeholder="Search by user email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : isError ? (
        <div>Error loading payments.</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Paid At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: IPayment) => (
                <TableRow key={payment.id}>
                  <TableCell className="truncate max-w-[100px]">{payment.id}</TableCell>
                  <TableCell className="truncate max-w-[100px]">{payment.orderId}</TableCell>
                  <TableCell>{payment.order.user.name}</TableCell>
                  <TableCell>{payment.order.user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={payment.status}
                      onValueChange={(value) =>
                        handleStatusChange(payment.id, value as PaymentStatus)
                      }
                      disabled={updateLoading && updatingId === payment.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUND">Refund</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsPage;