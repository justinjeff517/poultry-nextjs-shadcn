"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface BatchData {
  batch_id: string;
  name: string;
  slug: string;
  stage: string;
  breed: string;
  day_one_date: string;
  initial_population: number;
}

export default function Page() {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [displayedBatches, setDisplayedBatches] = useState<BatchData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      const res = await fetch("/api/database/batches/get-batches", {
        cache: "no-store",
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      const dataList = (json.batches || []).map((b: any) => b.data);
      dataList.sort(
        (a, b) =>
          new Date(b.day_one_date).getTime() -
          new Date(a.day_one_date).getTime()
      );
      setBatches(dataList);
      setDisplayedBatches(dataList);
      setLoading(false);
    }
    fetchBatches().catch(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(batches, {
        keys: ["name", "slug", "stage", "breed"],
        threshold: 0.3,
      }),
    [batches]
  );

  useEffect(() => {
    if (!searchQuery) {
      setDisplayedBatches(batches);
    } else {
      const results = fuse.search(searchQuery).map((r) => r.item);
      setDisplayedBatches(results);
    }
  }, [searchQuery, batches, fuse]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Link href="/growers/new-batch">
          <Button className="justify-start">
            <span>New Batch</span>
          </Button>
        </Link>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 w-1/2"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Day One Date</TableHead>
            <TableHead>Initial Population</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedBatches.map((b) => (
            <TableRow key={b.batch_id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>{b.stage}</TableCell>
              <TableCell>{b.breed}</TableCell>
              <TableCell>{b.day_one_date}</TableCell>
              <TableCell>{b.initial_population}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/growers/${b.slug}`}>View</Link>
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
