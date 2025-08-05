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
import { useGetUsersQuery, useUpdateUserMutation } from "@/redux/api/user/userApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IUser } from "@/types/user/user";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetUsersQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const handleRoleChange = async (userId: string, role: "USER" | "ADMIN") => {
    setUpdatingId(userId);
    try {
      await updateUser({ id: userId, data: { role } }).unwrap();
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          Loading...
        </div>
      ) : isError ? (
        <div>Error loading users.</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: IUser) => (
                <TableRow key={user.id}>
                  <TableCell className="truncate max-w-[100px]">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === "ADMIN" ? "USER" : "ADMIN"
                        )
                      }
                      disabled={updateLoading && updatingId === user.id}
                    >
                      {updateLoading && updatingId === user.id
                        ? "Updating..."
                        : user.role === "ADMIN"
                        ? "Make User"
                        : "Make Admin"}
                    </Button>
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

export default UsersPage;