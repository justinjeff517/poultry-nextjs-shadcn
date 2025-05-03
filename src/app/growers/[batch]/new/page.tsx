"use client"
import React from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type RecordFormValues = {
  date: string
  day_age: number
  week_age: number
  feeds_grams: number
  dead: number
  previous_population: number
  current_population: number
  medications: string       // comma-separated names
  vaccinations: string      // comma-separated names
}

type AddRecordFormProps = {
  startDate?: string         // optional; defaults to today
  previousPopulation?: number // optional; defaults to 0
}

export default function AddRecordForm({
  startDate = new Date().toISOString().split("T")[0],
  previousPopulation = 0,
}: AddRecordFormProps) {
  const today = new Date().toISOString().split("T")[0]
  const dayAge =
    Math.floor(
      (new Date(today).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  const weekAge = Math.ceil(dayAge / 7)

  const form = useForm<RecordFormValues>({
    defaultValues: {
      date: today,
      day_age: dayAge,
      week_age: weekAge,
      feeds_grams: 0,
      dead: 0,
      previous_population: previousPopulation,
      current_population: previousPopulation,
      medications: "",
      vaccinations: "",
    },
  })

  function onSubmit(values: RecordFormValues) {
    const meds = values.medications
      .split(",")
      .map((name) => ({
        name: name.trim(),
        slug: name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
      }))
    const vaxes = values.vaccinations
      .split(",")
      .map((name) => ({
        name: name.trim(),
        slug: name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
      }))

    console.log({
      ...values,
      medications: meds,
      vaccinations: vaxes,
    })
    // → send to your API here
  }

  return (

    <div className="flex w-full h-screen">
    <div className="w-[30%] p-4">
      Left Column (30%)
    </div>
    <div className="w-[70%] p-4">

        <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md mx-auto"
        >
            {/* Read-only calculated and prefilled fields */}
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} disabled />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            {(
            [
                "day_age",
                "week_age",
                "previous_population",
                "current_population",
            ] as const
            ).map((key) => (
            <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                    {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                    <Input type="number" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            ))}

            {/* User-input fields */}
            {(["feeds_grams", "dead"] as const).map((key) => (
            <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                    {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </FormLabel>
                    <FormControl>
                    <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            ))}

            <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Medications (comma-separated)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. PureTubig, VitaBoost" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="vaccinations"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Vaccinations (comma-separated)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Ma5+clone30" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit">Add Record</Button>
        </form>
        </Form>
    </div>
  </div>
  
  )
}
