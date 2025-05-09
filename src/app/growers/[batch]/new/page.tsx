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
    medications: [],
    vaccinations: [],
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
    //log data
    console.log(values);
    const meds =
      values.medications
        ?.map((slug) => medOptions.find((m) => m.value === slug)!)
        .filter(Boolean) ?? [];
    const vaxes =
      values.vaccinations
        ?.map((slug) => vacOptions.find((v) => v.value === slug)!)
        .filter(Boolean) ?? [];

    await new Promise((r) => setTimeout(r, 500));
    console.log({ ...values, medications: meds, vaccinations: vaxes });

    setPreviousRecord({
      ...values,
      medications: meds.map((m) => m.value),
      vaccinations: vaxes.map((v) => v.value),
    });
    form.reset(defaultValues);
  };

  return (
    <div className="flex">
      {/* Previous Data */}
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
                    {k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                  </dt>
                  <dd>
                    {Array.isArray(v) ? v.join(", ") : v ?? "—"}
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Add New Record */}
      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                {/* Auto-filled fields */}
                {["date","day_age","week_age","previous_population","current_population"].map((name) => (
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
                ))}

                {/* User inputs */}
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

                {/* Medications */}
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

                {/* Vaccinations */}
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

                {/* Actions */}
                <CardFooter className="col-span-2 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset(defaultValues)}
                    disabled={form.formState.isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Add Record"}
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
