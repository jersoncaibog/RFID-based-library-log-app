"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Visit {
  check_in_id: number;
  student: {
    first_name: string;
    last_name: string;
    rfid_number: string;
    course: string;
    year_level: string;
    section: string;
  };
  check_in_time: string;
  check_in_date: string;
}

export default function VisitLogPage() {
  const { toast } = useToast();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisits = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (course) params.append("grade", course);
      if (date) {
        const selectedDate = new Date(date);
        params.append("startDate", selectedDate.toISOString());
        selectedDate.setHours(23, 59, 59, 999);
        params.append("endDate", selectedDate.toISOString());
      }

      const res = await fetch(`/api/visits?${params}`);
      if (!res.ok) throw new Error("Failed to fetch visits");
      const data = await res.json();
      setVisits(data.visits);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [search, course, date, currentPage]);

  const handleExport = async () => {
    try {
      toast({
        title: "Downloading CSV",
        description: "Your file will be downloaded shortly...",
      });

      // Get all visits for export
      const params = new URLSearchParams({
        page: "1",
        limit: "1000", // Get more records for export
      });
      if (search) params.append("search", search);
      if (course) params.append("grade", course);
      if (date) {
        const selectedDate = new Date(date);
        params.append("startDate", selectedDate.toISOString());
        selectedDate.setHours(23, 59, 59, 999);
        params.append("endDate", selectedDate.toISOString());
      }

      const res = await fetch(`/api/visits?${params}`);
      if (!res.ok) throw new Error("Failed to fetch visits");
      const data = await res.json();

      // Convert to CSV
      const headers = [
        "Date",
        "Time",
        "Name",
        "RFID",
        "Course",
        "Year",
        "Section",
      ];
      const rows = data.visits.map((visit: Visit) => [
        new Date(visit.check_in_date).toLocaleDateString(),
        new Date(
          `${visit.check_in_date}T${visit.check_in_time}`
        ).toLocaleTimeString(),
        `${visit.student.first_name} ${visit.student.last_name}`,
        visit.student.rfid_number,
        visit.student.course,
        visit.student.year_level,
        visit.student.section,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row: string[]) => row.join(",")),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `visit_log_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Complete",
        description: "The CSV file has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export visit log to CSV.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visit Log</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchVisits}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={handleExport}>Export to CSV</Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or RFID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BSIT">BSIT</SelectItem>
                <SelectItem value="BSIS">BSIS</SelectItem>
                <SelectItem value="BSBA">BSBA</SelectItem>
                <SelectItem value="BSED">BSED</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visit Log Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Check-in Time</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>RFID</TableHead>
                <TableHead>Course & Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit) => (
                <TableRow key={visit.check_in_id}>
                  <TableCell>
                    {(() => {
                      try {
                        const date = new Date(
                          `${visit.check_in_date} ${visit.check_in_time}`
                        );
                        return date.toLocaleString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });
                      } catch (e) {
                        console.error("Date parsing error:", e);
                        return "Invalid Date";
                      }
                    })()}
                  </TableCell>
                  <TableCell>
                    {visit.student.first_name} {visit.student.last_name}
                  </TableCell>
                  <TableCell className="font-mono">
                    {visit.student.rfid_number}
                  </TableCell>
                  <TableCell>
                    {visit.student.course} {visit.student.year_level}-
                    {visit.student.section}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
