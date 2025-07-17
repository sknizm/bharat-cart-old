"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type UserWithRestaurant = {
  id: string;
  email: string;
  restaurant: {
    name: string;
    whatsapp: string | null;
    logo: string | null;
  } | null;
};

const getInitials = (name?: string | null) => {
  if (!name) return "R";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();
};

const Users = () => {
  const [users, setUsers] = useState<UserWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/get-all-users?includeRestaurant=true");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("You can only delete your own account");
        } else if (res.status === 400 && data.restaurantId) {
          throw new Error(`Please delete the restaurant (ID: ${data.restaurantId}) first`);
        } else {
          throw new Error(data.error || "Failed to delete user");
        }
      }
  
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success("User deleted successfully");
      
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="w-full h-auto shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">Restaurant Owners</CardTitle>
          <Button variant="outline" className="border-blue-500 text-blue-600 hover:text-blue-700">
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[300px]">Restaurant</TableHead>
                <TableHead>Owner Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.restaurant?.logo || ""} alt={user.restaurant?.name || "Restaurant"} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(user.restaurant?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.restaurant?.name || "No Restaurant"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    {user.restaurant?.whatsapp ? (
                      <a 
                        href={`https://wa.me/${user.restaurant.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.restaurant.whatsapp}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingId === user.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-2">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Users;