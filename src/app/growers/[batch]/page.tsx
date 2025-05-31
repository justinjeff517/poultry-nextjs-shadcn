"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Text } from "@/components/ui/typography";

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

const sampleData: RecordType[] = [
  {
    record_id: "1",
    record_date: "2025-04-29",
    day_age: 1,
    week_age: 1,
    feed_grams: 1500,
    dead_count: 0,
    prev_population: 2000,
    curr_population: 2000,
    medications: [{ name: "PureTubig", slug: "puretubig" }],
    vaccinations: [{ name: "Ma5+clone30", slug: "ma5_clone30" }],
  },
  {
    record_id: "2",
    record_date: "2025-04-30",
    day_age: 2,
    week_age: 1,
    feed_grams: 1600,
    dead_count: 2,
    prev_population: 2000,
    curr_population: 1998,
    medications: [{ name: "VitaBoost", slug: "vitaboost" }],
    vaccinations: [],
  },
  {
    record_id: "3",
    record_date: "2025-05-01",
    day_age: 3,
    week_age: 1,
    feed_grams: 1650,
    dead_count: 1,
    prev_population: 1998,
    curr_population: 1997,
    medications: [],
    vaccinations: [],
  },
  {
    record_id: "4",
    record_date: "2025-05-02",
    day_age: 4,
    week_age: 1,
    feed_grams: 1620,
    dead_count: 0,
    prev_population: 1997,
    curr_population: 1997,
    medications: [],
    vaccinations: [],
  },
  {
    record_id: "5",
    record_date: "2025-05-03",
    day_age: 5,
    week_age: 1,
    feed_grams: 1580,
    dead_count: 1,
    prev_population: 1997,
    curr_population: 1996,
    medications: [{ name: "Electrolytes", slug: "electrolytes" }],
    vaccinations: [],
  },
  {
    record_id: "6",
    record_date: "2025-05-04",
    day_age: 6,
    week_age: 1,
    feed_grams: 1550,
    dead_count: 0,
    prev_population: 1996,
    curr_population: 1996,
    medications: [],
    vaccinations: [],
  },
  {
    record_id: "7",
    record_date: "2025-05-05",
    day_age: 7,
    week_age: 1,
    feed_grams: 1575,
    dead_count: 1,
    prev_population: 1996,
    curr_population: 1995,
    medications: [],
    vaccinations: [],
  },
  {
    record_id: "8",
    record_date: "2025-05-06",
    day_age: 8,
    week_age: 2,
    feed_grams: 1620,
    dead_count: 0,
    prev_population: 1995,
    curr_population: 1995,
    medications: [{ name: "AquaZinc", slug: "aquazinc" }],
    vaccinations: [],
  },
  {
    record_id: "9",
    record_date: "2025-05-07",
    day_age: 9,
    week_age: 2,
    feed_grams: 1650,
    dead_count: 0,
    prev_population: 1995,
    curr_population: 1995,
    medications: [],
    vaccinations: [],
  },
  {
    record_id: "10",
    record_date: "2025-05-08",
    day_age: 10,
    week_age: 2,
    feed_grams: 1700,
    dead_count: 2,
    prev_population: 1995,
    curr_population: 1993,
    medications: [],
    vaccinations: [{ name: "IB+ND", slug: "ib_nd" }],
  },
];

const sortedData = sampleData.sort((a, b) => a.day_age - b.day_age);
const latestPopulation = sortedData[sortedData.length - 1].curr_population;

export default function Page() {
  const params = useParams();
  const slug = params.batch;

  return (
    <div>

    <div className="flex items-center justify-between border-b border-gray-200 py-2">
      <p className="text-sm font-medium text-muted-foreground">
        Batch:{" "}
        <span className="text-base font-semibold text-primary">
          Alpha Flock
        </span>
      </p>
      <p className="text-sm font-medium text-muted-foreground">
        Current Population:{" "}
        <span className="text-base font-semibold text-primary">
          {latestPopulation}
        </span>
      </p>
    </div>

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
          {sortedData.map((r) => (
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
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/growers/${slug}/${r.record_id}`}>
                        Modify
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
