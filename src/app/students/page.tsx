"use client";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  student_id: number;
  rfid_number: string;
  first_name: string;
  last_name: string;
  course: string;
  year_level: string;
  section: string;
  _count: {
    check_ins: number;
  };
}

function AddStudentDialog() {
  const [formData, setFormData] = useState({
    rfid_number: "",
    first_name: "",
    last_name: "",
    course: "",
    year_level: "",
    section: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create student");
      window.location.reload();
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Student</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student&apos;s information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rfid" className="text-right">
                RFID
              </Label>
              <Input
                id="rfid"
                value={formData.rfid_number}
                onChange={(e) =>
                  setFormData({ ...formData, rfid_number: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) =>
                  setFormData({ ...formData, course: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSIT">BSIT</SelectItem>
                  <SelectItem value="BSIS">BSIS</SelectItem>
                  <SelectItem value="BSBA">BSBA</SelectItem>
                  <SelectItem value="BSED">BSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearLevel" className="text-right">
                Year Level
              </Label>
              <Select
                value={formData.year_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, year_level: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Select
                value={formData.section}
                onValueChange={(value) =>
                  setFormData({ ...formData, section: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                  <SelectItem value="E">Section E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditStudentDialog({
  student,
  onUpdate,
}: {
  student: Student;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState({
    rfid_number: student.rfid_number,
    first_name: student.first_name,
    last_name: student.last_name,
    course: student.course,
    year_level: student.year_level,
    section: student.section,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${student.student_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update student");
      onUpdate();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the student&apos;s information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rfid" className="text-right">
                RFID
              </Label>
              <Input
                id="rfid"
                value={formData.rfid_number}
                onChange={(e) =>
                  setFormData({ ...formData, rfid_number: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) =>
                  setFormData({ ...formData, course: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSIT">BSIT</SelectItem>
                  <SelectItem value="BSIS">BSIS</SelectItem>
                  <SelectItem value="BSBA">BSBA</SelectItem>
                  <SelectItem value="BSED">BSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearLevel" className="text-right">
                Year Level
              </Label>
              <Select
                value={formData.year_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, year_level: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Select
                value={formData.section}
                onValueChange={(value) =>
                  setFormData({ ...formData, section: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                  <SelectItem value="E">Section E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteStudentDialog({
  student,
  onDelete,
}: {
  student: Student;
  onDelete: () => void;
}) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/students/${student.student_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      onDelete();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-red-600 hover:text-red-900">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {student.first_name} {student.last_name}&apos;s record from the
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (search) params.append("search", search);
      if (course) params.append("grade", course);
      if (year) params.append("section", year);

      const res = await fetch(`/api/students?${params}`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data.students);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, course, year, currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStudents}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <AddStudentDialog />
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search students..."
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
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
                <SelectItem value="D">Section D</SelectItem>
                <SelectItem value="E">Section E</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course & Year</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-mono">
                    {student.rfid_number}
                  </TableCell>
                  <TableCell>
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>
                    {student.course} {student.year_level}-{student.section}
                  </TableCell>
                  <TableCell>{student._count.check_ins}</TableCell>
                  <TableCell className="text-right">
                    <EditStudentDialog
                      student={student}
                      onUpdate={fetchStudents}
                    />
                    <DeleteStudentDialog
                      student={student}
                      onDelete={fetchStudents}
                    />
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
