import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the leaderboard
const mockLeaderboard = [
  { id: 1, name: "John Doe", visits: 45, course: "BSIT 2A" },
  { id: 2, name: "Jane Smith", visits: 42, course: "BSCS 3B" },
  { id: 3, name: "Mike Johnson", visits: 38, course: "BSIS 2C" },
  { id: 4, name: "Sarah Williams", visits: 35, course: "BSIT 1A" },
  { id: 5, name: "David Brown", visits: 33, course: "BSCS 2A" },
  { id: 6, name: "Emily Davis", visits: 30, course: "BSIS 3B" },
  { id: 7, name: "James Wilson", visits: 28, course: "BSIT 4C" },
  { id: 8, name: "Lisa Anderson", visits: 25, course: "BSCS 1C" },
  { id: 9, name: "Robert Taylor", visits: 23, course: "BSIS 1B" },
  { id: 10, name: "Mary Martin", visits: 20, course: "BSIT 3A" },
];

function CheckInForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="rfid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Scan RFID Card
            </label>
            <Input
              id="rfid"
              placeholder="Place RFID card on scanner..."
              autoFocus
            />
          </div>
          <Button className="w-full" type="submit">
            Check In
          </Button>
        </form>
        
        {/* Status display area */}
        <div className="mt-6 p-4 bg-slate-50 rounded-md">
          <p className="text-slate-600">Waiting for card scan...</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Visitors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Course & Sec</TableHead>
              <TableHead className="text-right">Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLeaderboard.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell className="text-right">{student.visits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <CheckInForm />
      <Leaderboard />
    </div>
  );
}
