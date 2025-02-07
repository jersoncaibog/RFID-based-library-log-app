import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for visit logs
const mockVisitLogs = [
  { id: 1, studentName: "John Doe", rfid: "RF001", course: "BSBA 2A", checkInTime: "2024-02-07 09:15:23" },
  { id: 2, studentName: "Jane Smith", rfid: "RF002", course: "BSED 3B", checkInTime: "2024-02-07 09:30:45" },
  { id: 3, studentName: "Mike Johnson", rfid: "RF003", course: "BSIS 2C", checkInTime: "2024-02-07 10:05:12" },
  { id: 4, studentName: "Sarah Williams", rfid: "RF004", course: "BSIT 1A", checkInTime: "2024-02-07 10:15:33" },
  { id: 5, studentName: "David Brown", rfid: "RF005", course: "BSBA 2A", checkInTime: "2024-02-07 10:45:18" },
  { id: 6, studentName: "Emily Davis", rfid: "RF006", course: "BSIS 3B", checkInTime: "2024-02-07 11:00:55" },
  { id: 7, studentName: "James Wilson", rfid: "RF007", course: "BSIT 4C", checkInTime: "2024-02-07 11:20:40" },
  { id: 8, studentName: "Lisa Anderson", rfid: "RF008", course: "BSED 1C", checkInTime: "2024-02-07 11:35:27" },
  { id: 9, studentName: "Robert Taylor", rfid: "RF009", course: "BSIS 1B", checkInTime: "2024-02-07 12:05:15" },
  { id: 10, studentName: "Mary Martin", rfid: "RF010", course: "BSIT 3A", checkInTime: "2024-02-07 12:30:08" },
];

export default function VisitLogPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visit Log</h1>
        <Button>
          Export to CSV
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or RFID..."
              className="w-full"
            />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bsit">BSIT</SelectItem>
                <SelectItem value="bsis">BSIS</SelectItem>
                <SelectItem value="bsba">BSBA</SelectItem>
                <SelectItem value="bsed">BSED</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
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
              {mockVisitLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.checkInTime}</TableCell>
                  <TableCell>{log.studentName}</TableCell>
                  <TableCell className="font-mono">{log.rfid}</TableCell>
                  <TableCell>{log.course}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <p className="text-sm text-slate-600">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
              <span className="font-medium">50</span> results
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 