// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const sampleData = [
  {
    id: "1",
    date: "2025-04-29",
    flock_name: "Alpha Flock",
    flock_slug: "alpha-flock",
    feeds_grams: 1500,
    dead: 0,
    previous_population: 2000,
    current_population: 2000,
    medications: [
      { name: "PureTubig", slug: "puretubig" },
      { name: "MoreMeta Multivitamins", slug: "moremeta-multivitamins" },
    ],
    vaccinations: [{ name: "Ma5+clone30", slug: "ma5clone30" }],
  },
];

const medOptions = [
  { name: "PureTubig", slug: "puretubig" },
  { name: "MoreMeta Multivitamins", slug: "moremeta-multivitamins" },
];

const vaccOptions = [
  { name: "Ma5+clone30", slug: "ma5clone30" },
  { name: "Gumboro 228E", slug: "gumboro-228e" },
];

export default function Page() {
  const FLOCK_NAME = "Alpha Flock";

  const [logs, setLogs] = useState(sampleData);
  const [form, setForm] = useState({
    date: "",
    feeds_grams: 0,
    deadCount: "0",
    medications: [] as string[],
    vaccinations: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deadOptions, setDeadOptions] = useState<{ label: string; value: string }[]>([]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [inputVisible, setInputVisible] = useState(true);

  // 1) Auto-set next date when not editing
  useEffect(() => {
    if (!editingId && logs.length) {
      const next = new Date(Math.max(...logs.map(l => new Date(l.date).getTime())));
      next.setDate(next.getDate() + 1);
      setForm(f => ({ ...f, date: next.toISOString().split("T")[0] }));
    }
  }, [logs, editingId]);

  // 2) Build dead count options starting from 0, then 1–1% of last pop
  useEffect(() => {
    const lastPop = logs[0]?.current_population ?? 0;
    const maxOnePercent = Math.ceil((1 / 100) * lastPop);
    const opts = [{ label: "0 birds", value: "0" }];
    for (let i = 1; i <= maxOnePercent; i++) {
      opts.push({ label: `${i} birds`, value: String(i) });
    }
    setDeadOptions(opts);
    // default to 0 on each reset/new-add
    setForm(f => ({ ...f, deadCount: "0" }));
  }, [logs]);

  const toggleMed = (slug: string) =>
    setForm(f => ({
      ...f,
      medications: f.medications.includes(slug)
        ? f.medications.filter(s => s !== slug)
        : [...f.medications, slug],
    }));

  const toggleVacc = (slug: string) =>
    setForm(f => ({
      ...f,
      vaccinations: f.vaccinations.includes(slug)
        ? f.vaccinations.filter(s => s !== slug)
        : [...f.vaccinations, slug],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deadCount = Number(form.deadCount);
    const prevPop = logs[0]?.current_population ?? 0;
    const currPop = prevPop - deadCount;

    const meds = form.medications
      .map(s => medOptions.find(m => m.slug === s))
      .filter(Boolean)
      .map(m => ({ name: m!.name, slug: m!.slug }));
    const vaxs = form.vaccinations
      .map(s => vaccOptions.find(v => v.slug === s))
      .filter(Boolean)
      .map(v => ({ name: v!.name, slug: v!.slug }));

    const entry = {
      id: editingId ?? Date.now().toString(),
      date: form.date,
      flock_name: FLOCK_NAME,
      flock_slug: FLOCK_NAME.toLowerCase().replace(/\s+/g, "-"),
      feeds_grams: form.feeds_grams,
      dead: deadCount,
      previous_population: prevPop,
      current_population: currPop,
      medications: meds,
      vaccinations: vaxs,
    };

    setLogs(prev =>
      editingId
        ? [entry, ...prev.filter(l => l.id !== editingId)]
        : [entry, ...prev]
    );

    // 3) Reset fields except date, dead goes back to "0"
    setForm(f => ({
      ...f,
      feeds_grams: 0,
      deadCount: "0",
      medications: [],
      vaccinations: [],
    }));

    setInputVisible(false);
    setShowConfirmation(true);
  };

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setForm({
      date: entry.date,
      feeds_grams: entry.feeds_grams,
      deadCount: String(entry.dead),
      medications: entry.medications.map((m: any) => m.slug),
      vaccinations: entry.vaccinations.map((v: any) => v.slug),
    });
    setShowConfirmation(false);
    setInputVisible(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this record?")) return;
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Confirmation panel */}
      {showConfirmation && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          Record added!
          <div className="mt-2 flex space-x-2">
            <Button
              onClick={() => {
                setInputVisible(true);
                setShowConfirmation(false);
                setEditingId(null);
              }}
            >
              Add Again
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      {inputVisible && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.date} readOnly />
          </div>

          <div className="col-span-2">
            <Label>Flock</Label>
            <p className="mt-1">{FLOCK_NAME}</p>
          </div>

          <div>
            <Label>Feeds (g)</Label>
            <Input
              type="number"
              value={form.feeds_grams}
              onChange={e =>
                setForm(f => ({ ...f, feeds_grams: +e.target.value }))
              }
            />
          </div>

          <div className="col-span-2">
            <Label>Dead</Label>
            <Select
              value={form.deadCount}
              onValueChange={v => setForm(f => ({ ...f, deadCount: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {deadOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label>Medications</Label>
            {medOptions.map(m => (
              <div key={m.slug} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.medications.includes(m.slug)}
                  onCheckedChange={() => toggleMed(m.slug)}
                />
                <span>{m.name}</span>
              </div>
            ))}
          </div>

          <div className="col-span-2">
            <Label>Vaccinations</Label>
            {vaccOptions.map(v => (
              <div key={v.slug} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.vaccinations.includes(v.slug)}
                  onCheckedChange={() => toggleVacc(v.slug)}
                />
                <span>{v.name}</span>
              </div>
            ))}
          </div>

          <div className="col-span-2 flex space-x-2">
            <Button type="submit">
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    date: form.date,
                    feeds_grams: 0,
                    deadCount: "0",
                    medications: [],
                    vaccinations: [],
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Flock</TableHead>
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
          {logs.map((l, i) => (
            <TableRow key={l.id} className={i === 0 ? "bg-green-50" : ""}>
              <TableCell>{l.date}</TableCell>
              <TableCell>{l.flock_name}</TableCell>
              <TableCell>{l.feeds_grams}</TableCell>
              <TableCell>{l.dead}</TableCell>
              <TableCell>{l.previous_population}</TableCell>
              <TableCell>{l.current_population}</TableCell>
              <TableCell>
                {l.medications.map(m => m.name).join(", ")}
              </TableCell>
              <TableCell>
                {l.vaccinations.map(v => v.name).join(", ")}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(l)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(l.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
