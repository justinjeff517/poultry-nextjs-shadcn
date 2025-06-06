"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface RecordType {
  record_id: string;
  record_date: string;
  day_age: number;
  week_age: number;
  feed_grams: number;
  dead_count: number;
  prev_population: number;
  curr_population: number;
  medications: { name: string; slug: string }[];
  vaccinations: { name: string; slug: string }[];
}

export default function Page() {
  const params = useParams();
  const slug = params.batch;

  const [records, setRecords] = useState<RecordType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      const res = await fetch(
        `/api/database/records/get-records-by-batch?batch_slug=${encodeURIComponent(
          slug!
        )}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch records");
      const json = await res.json();
      // Assuming the API returns { records: RecordType[] }
      setRecords(json.records || []);
      setLoading(false);
    }

    if (slug) {
      fetchRecords().catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 my-2">
        <Link href={`/growers/${slug}/new`}>
          <Button asChild className="justify-start">
            <span>New Record</span>
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day Age</TableHead>
            <TableHead>Week Age</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Feed (g)</TableHead>
            <TableHead>Dead</TableHead>
            <TableHead>Prev Pop</TableHead>
            <TableHead>Curr Pop</TableHead>
            <TableHead>Medications</TableHead>
            <TableHead>Vaccinations</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((r) => (
            <TableRow key={r.record_id}>
              <TableCell>{r.day_age}</TableCell>
              <TableCell>{r.week_age}</TableCell>
              <TableCell>{r.record_date}</TableCell>
              <TableCell>{r.feed_grams}</TableCell>
              <TableCell>{r.dead_count}</TableCell>
              <TableCell>{r.prev_population}</TableCell>
              <TableCell>{r.curr_population}</TableCell>
              <TableCell>{r.medications.map((m) => m.name).join(", ")}</TableCell>
              <TableCell>{r.vaccinations.map((v) => v.name).join(", ")}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/growers/${slug}/${r.record_id}`}>
                        View
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
