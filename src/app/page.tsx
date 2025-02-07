"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

interface LeaderboardEntry {
  student_id: number;
  full_name: string;
  visit_count: number;
}

function CheckInForm({
  onSuccessfulCheckIn,
}: {
  onSuccessfulCheckIn: () => void;
}) {
  const [rfid, setRfid] = useState("");
  const [status, setStatus] = useState("Waiting for card scan...");

  const handleRefresh = () => {
    setRfid("");
    setStatus("Waiting for card scan...");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfid_number: rfid }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error);
        return;
      }

      setStatus(
        `${data.checkIn.student.first_name} ${data.checkIn.student.last_name} checked in successfully`
      );
      setRfid("");
      onSuccessfulCheckIn();
    } catch (error) {
      console.error("Error checking in:", error);
      setStatus("Failed to check in. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Student Check-in</CardTitle>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="rfid"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Scan RFID Card
            </label>
            <Input
              id="rfid"
              value={rfid}
              onChange={(e) => setRfid(e.target.value)}
              placeholder="Place RFID card on scanner..."
              autoFocus
            />
          </div>
          <Button className="w-full" type="submit">
            Check In
          </Button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-md">
          <p className="text-slate-600">{status}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Leaderboard({ refreshTrigger }: { refreshTrigger: number }) {
  const [topVisitors, setTopVisitors] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard?period=month");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      const data = await res.json();
      setTopVisitors(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Top Visitors</CardTitle>
            <Button variant="outline" onClick={fetchLeaderboard}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Top Visitors</CardTitle>
          <Button variant="outline" onClick={fetchLeaderboard}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Visits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topVisitors.map((entry, index) => (
              <TableRow key={entry.student_id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.full_name}</TableCell>
                <TableCell className="text-right">
                  {entry.visit_count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [lastCheckIn, setLastCheckIn] = useState<number>(0);

  const handleSuccessfulCheckIn = () => {
    setLastCheckIn(Date.now());
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 justify-center">
        <div className="h-fit w-full max-w-[400px] mx-auto">
          <CheckInForm onSuccessfulCheckIn={handleSuccessfulCheckIn} />
        </div>
        <div className="h-fit w-full max-w-[900px] mx-auto">
          <Leaderboard refreshTrigger={lastCheckIn} />
        </div>
      </div>
    </div>
  );
}
