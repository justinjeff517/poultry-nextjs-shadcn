"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MultiSelect } from "@/components/multi-select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  previous_population: z.number().min(0),
  feeds_grams: z.number().min(0),
  dead: z.number().min(0),
  current_population: z.number().min(0),
  medications: z.array(z.string()).optional(),
  vaccinations: z.array(z.string()).optional(),
});
type RecordFormValues = z.infer<typeof recordFormSchema>;

type Props = {
  startDate?: string;
  initialPopulation?: number;
};

export default function EditRecordPage({
  startDate = new Date().toISOString().split("T")[0],
  initialPopulation = 1250,
}: Props) {
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
    previous_population: initialPopulation,
    feeds_grams: 0,
    dead: 0,
    current_population: initialPopulation,
    medications: [],
    vaccinations: [],
  });

  const defaultValues = useMemo<RecordFormValues>(
    () => ({
      date: today,
      day_age: dayAge,
      week_age: weekAge,
      previous_population: previousRecord.current_population,
      feeds_grams: 0,
      dead: 0,
      current_population: previousRecord.current_population,
      medications: [],
      vaccinations: [],
    }),
    [today, dayAge, weekAge, previousRecord.current_population]
  );

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const dead = form.watch("dead");
  const prevPop = form.watch("previous_population");
  useEffect(() => {
    form.setValue("current_population", prevPop - (dead ?? 0), {
      shouldValidate: true,
    });
  }, [dead, prevPop, form]);

  const onSubmit = async (values: RecordFormValues) => {
    const meds =
      values.medications
        ?.map((slug) => medOptions.find((m) => m.value === slug)!)
        .filter(Boolean) ?? [];
    const vaxes =
      values.vaccinations
        ?.map((slug) => vacOptions.find((v) => v.value === slug)!)
        .filter(Boolean) ?? [];

    await new Promise((r) => setTimeout(r, 500));
    console.log("Saving:", { ...values, medications: meds, vaccinations: vaxes });

    setPreviousRecord({
      ...values,
      medications: meds.map((m) => m.value),
      vaccinations: vaxes.map((v) => v.value),
    });
    form.reset(defaultValues);
  };

  const handleDelete = () => {
    // TODO: Add deletion logic here (e.g. API call)
    console.log("Record deleted");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Previous Data */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Previous Data</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(previousRecord).map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="font-medium">
                    {k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </dt>
                  <dd>{Array.isArray(v) ? v.join(", ") : v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                {/** auto-filled fields **/}
                {["date", "day_age", "week_age", "previous_population", "current_population"].map(
                  (name) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
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
                  )
                )}

                {/** feeds & dead inputs **/}
                <FormField
                  control={form.control}
                  name="feeds_grams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeds (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ''}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
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
                          value={field.value ?? ''}
                          onChange={e => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/** meds & vaccinations selects **/}
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
                          multiple
                          placeholder="Select vaccinations"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/** footer with reset, save, delete **/}
                <CardFooter className="col-span-2 flex flex-col sm:flex-row sm:justify-end flex-wrap gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset(defaultValues)}
                    disabled={form.formState.isSubmitting}
                  >
                    Reset
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" type="button">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Are you sure you want to delete this record?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
