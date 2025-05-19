// src/app/daily-pullet-records/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MultiSelect } from "@/components/multi-select";

const medOptions = [
  { value: "tylosin", label: "Tylosin" },
  { value: "amoxicillin", label: "Amoxicillin" },
  { value: "oxytetracycline", label: "Oxytetracycline" },
];
const vacOptions = [
  { value: "nd-b1", label: "ND B1" },
  { value: "ib-h120", label: "IB H120" },
  { value: "marek", label: "Marek" },
];

const recordFormSchema = z.object({
  date: z.string().nonempty("Date is required"),
  day_age: z.number().min(0),
  week_age: z.number().min(0),
  feeds_grams: z.number().min(0),
  dead: z.number().min(0),
  previous_population: z.number().min(0),
  current_population: z.number().min(0),
  medications: z.array(z.string()).optional(),
  vaccinations: z.array(z.string()).optional(),
  text_summary: z.string().nonempty("Summary is required"),
});
type RecordFormValues = z.infer<typeof recordFormSchema>;

type Props = {
  startDate?: string;
  initialPopulation?: number;
};

export default function Page({
  startDate = new Date().toISOString().split("T")[0],
  initialPopulation = 1250,
}: Props) {
  const { data: session } = useSession();
  const today = new Date().toISOString().split("T")[0];
  const dayAge =
    Math.floor(
      (new Date(today).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;
  const weekAge = Math.ceil(dayAge / 7);

  const [previousRecord, setPreviousRecord] = useState<RecordFormValues>({
    date: today,
    day_age: dayAge,
    week_age: weekAge,
    feeds_grams: 0,
    dead: 0,
    previous_population: initialPopulation,
    current_population: initialPopulation,
    medications: ["tylosin", "oxytetracycline"],    // ← dummy meds
    vaccinations: ["nd-b1", "marek"],               // ← dummy vax
    text_summary: "This is a dummy AI-generated summary for now.",
  });

  const defaultValues = useMemo<RecordFormValues>(
    () => ({
      date: today,
      day_age: dayAge,
      week_age: weekAge,
      feeds_grams: 0,
      dead: 0,
      previous_population: previousRecord.current_population,
      current_population: previousRecord.current_population,
      medications: [],
      vaccinations: [],
      text_summary: "This is a dummy AI-generated summary for now.",
    }),
    [today, dayAge, weekAge, previousRecord.current_population]
  );

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // auto-recalculate current_population
  const dead = form.watch("dead");
  const prevPop = form.watch("previous_population");
  useEffect(() => {
    form.setValue("current_population", prevPop - (dead ?? 0), {
      shouldValidate: true,
    });
  }, [dead, prevPop, form]);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const onSubmit = (values: RecordFormValues) => {
    const now = new Date().toISOString()
    const userId = session?.user?.id ?? ""

    const payload = {
      data: {
        record_id: uuidv4(),
        record_date: values.date,               // YYYY-MM-DD
        day_age: values.day_age,                // 0–365
        week_age: values.week_age,              // 0–52
        feed_grams: values.feeds_grams,         // number ≥ 0
        dead_count: values.dead,                // integer ≥ 0
        prev_population: values.previous_population,
        curr_population: values.current_population,
        medications: values.medications?.map(slug => {
          const opt = medOptions.find(m => m.value === slug)!
          return { name: opt.label, slug: opt.value }
        }) ?? [],
        vaccinations: values.vaccinations?.map(slug => {
          const opt = vacOptions.find(v => v.value === slug)!
          return { name: opt.label, slug: opt.value }
        }) ?? [],
        text_summary: values.text_summary,
        created_at: now,       // date-time
        created_by: userId     // uuid
      }
    }

    console.log("Submitting payload:", payload)

  }


  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Previous Data</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(previousRecord).map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="font-medium">
                    {k
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    :
                  </dt>
                  <dd>{Array.isArray(v) ? v.join(", ") : v ?? "—"}</dd>
                </React.Fragment>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid grid-cols-2 gap-4">
                {[
                  "date",
                  "day_age",
                  "week_age",
                  "previous_population",
                  "current_population",
                ].map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {name
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={name === "date" ? "date" : "number"}
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="feeds_grams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeds (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dead"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dead</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Medications</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={medOptions}
                          multiple
                          placeholder="Select medications"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={form.control}
                  name="vaccinations"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Vaccinations</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={vacOptions}
                          placeholder="Select vaccinations"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="col-span-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset(defaultValues)}
                    disabled={form.formState.isSubmitting}
                  >
                    Reset
                  </Button>

                  <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        disabled={form.formState.isSubmitting}
                      >
                        Add Record
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm Create Record</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to create this record?
                        </DialogDescription>
                      </DialogHeader>

                      <Card className="mt-4">
                        <CardHeader className="border-b">
                          <CardTitle className="text-sm font-semibold text-gray-800">
                            AI-Generated Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-sm text-gray-600">
                            {form.getValues("text_summary")}
                          </p>
                        </CardContent>
                      </Card>

                      <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => form.handleSubmit(onSubmit)()}>
                          Confirm
                        </Button>
                      </DialogFooter>
                    </DialogContent>


                  </Dialog>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
