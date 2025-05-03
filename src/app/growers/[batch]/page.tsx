"use client";
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
  id: string;
  date: string;
  day_age: number;
  week_age: number;
  feeds_grams: number;
  dead: number;
  previous_population: number;
  current_population: number;
  medications: { name: string }[];
  vaccinations: { name: string }[];
}

const sampleData: RecordType[] = [
  {
    id: "1",
    date: "2025-04-29",
    day_age: 1,
    week_age: 1,
    feeds_grams: 1500,
    dead: 0,
    previous_population: 2000,
    current_population: 2000,
    medications: [{ name: "PureTubig" }],
    vaccinations: [{ name: "Ma5+clone30" }],
  },
  {
    id: "2",
    date: "2025-04-30",
    day_age: 2,
    week_age: 1,
    feeds_grams: 1600,
    dead: 2,
    previous_population: 2000,
    current_population: 1998,
    medications: [{ name: "VitaBoost" }],
    vaccinations: [],
  },
  {
    id: "3",
    date: "2025-05-01",
    day_age: 3,
    week_age: 1,
    feeds_grams: 1650,
    dead: 1,
    previous_population: 1998,
    current_population: 1997,
    medications: [],
    vaccinations: [],
  },
  {
    id: "4",
    date: "2025-05-02",
    day_age: 4,
    week_age: 1,
    feeds_grams: 1620,
    dead: 0,
    previous_population: 1997,
    current_population: 1997,
    medications: [],
    vaccinations: [],
  },
  {
    id: "5",
    date: "2025-05-03",
    day_age: 5,
    week_age: 1,
    feeds_grams: 1580,
    dead: 1,
    previous_population: 1997,
    current_population: 1996,
    medications: [{ name: "Electrolytes" }],
    vaccinations: [],
  },
  {
    id: "6",
    date: "2025-05-04",
    day_age: 6,
    week_age: 1,
    feeds_grams: 1550,
    dead: 0,
    previous_population: 1996,
    current_population: 1996,
    medications: [],
    vaccinations: [],
  },
  {
    id: "7",
    date: "2025-05-05",
    day_age: 7,
    week_age: 1,
    feeds_grams: 1575,
    dead: 1,
    previous_population: 1996,
    current_population: 1995,
    medications: [],
    vaccinations: [],
  },
  {
    id: "8",
    date: "2025-05-06",
    day_age: 8,
    week_age: 2,
    feeds_grams: 1620,
    dead: 0,
    previous_population: 1995,
    current_population: 1995,
    medications: [{ name: "AquaZinc" }],
    vaccinations: [],
  },
  {
    id: "9",
    date: "2025-05-07",
    day_age: 9,
    week_age: 2,
    feeds_grams: 1650,
    dead: 0,
    previous_population: 1995,
    current_population: 1995,
    medications: [],
    vaccinations: [],
  },
  {
    id: "10",
    date: "2025-05-08",
    day_age: 10,
    week_age: 2,
    feeds_grams: 1700,
    dead: 2,
    previous_population: 1995,
    current_population: 1993,
    medications: [],
    vaccinations: [{ name: "IB+ND" }],
  },
];

const sortedData = sampleData.sort((a, b) => a.day_age - b.day_age);

export default function Page() {
  const params = useParams();
  const slug = params.batch;
  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Alpha Flock Records</h1>
      </div>

      <div className="flex items-center gap-4">
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
            <TableHead>Feeds (g)</TableHead>
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
            <TableRow key={r.id}>
              <TableCell>{r.day_age}</TableCell>
              <TableCell>{r.week_age}</TableCell>
              <TableCell>{r.date}</TableCell>
              <TableCell>{r.feeds_grams}</TableCell>
              <TableCell>{r.dead}</TableCell>
              <TableCell>{r.previous_population}</TableCell>
              <TableCell>{r.current_population}</TableCell>
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
                    <DropdownMenuItem>Modify</DropdownMenuItem>
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
