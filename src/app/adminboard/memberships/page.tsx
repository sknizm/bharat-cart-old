"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

type MembershipWithRestaurant = {
  id: string;
  status: "ACTIVE" | "CANCELED" | "EXPIRED" | "PAUSED";
  startDate: string;
  endDate: string;
  renewsAt: string;
  restaurant: {
    slug: string;
    name: string;
  };
};

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dateEdits, setDateEdits] = useState<Record<string, { endDate: string }>>({});

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/memberships");
      const data = await res.json();
      setMemberships(data);
    } catch (error) {
      toast.error("Failed to fetch memberships");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckActive = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/memberships/check-status", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchMemberships();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to check memberships");
    } finally {
      setUpdating(false);
    }
  };

  const handleDateChange = (id: string, field: "endDate", value: string) => {
    setDateEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSaveDate = async (id: string) => {
    const updates = dateEdits[id];
    if (!updates?.endDate) return;

    try {
      const res = await fetch(`/api/memberships/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endDate: updates.endDate
        }),
      });

      if (res.ok) {
        toast.success("Membership updated successfully");
        fetchMemberships();
        setDateEdits(prev => {
          const newEdits = { ...prev };
          delete newEdits[id];
          return newEdits;
        });
      } else {
        throw new Error("Failed to update membership");
      }
    } catch (error) {
      toast.error('error');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "EXPIRED": return "destructive";
      case "PAUSED": return "secondary";
      case "CANCELED": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Membership Management</CardTitle>
        <Button onClick={handleCheckActive} disabled={updating}>
          {updating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Check Active Status
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : memberships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No memberships found
                </TableCell>
              </TableRow>
            ) : (
              memberships.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">
                    {membership.restaurant.name} ({membership.restaurant.slug})
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(membership.status)}>
                      {membership.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(membership.startDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {dateEdits[membership.id] ? (
                      <Input
                        type="date"
                        value={dateEdits[membership.id].endDate}
                        onChange={(e) => handleDateChange(membership.id, "endDate", e.target.value)}
                      />
                    ) : (
                      format(parseISO(membership.endDate), "MMM dd, yyyy")
                    )}
                  </TableCell>
                  <TableCell>
                    {dateEdits[membership.id] ? (
                      <Button
                        size="sm"
                        onClick={() => handleSaveDate(membership.id)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDateChange(membership.id, "endDate", membership.endDate)}
                      >
                        Edit Date
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}