"use client"
import React, { useRef } from "react"
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

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
  startDate?: string         // optional; defaults to initial flock date
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

  // define initial default values once
  const defaultValues: RecordFormValues = {
    date: today,
    day_age: dayAge,
    week_age: weekAge,
    feeds_grams: 0,
    dead: 0,
    previous_population: previousPopulation,
    current_population: previousPopulation,
    medications: "Tylosin, Amoxicillin",
    vaccinations: "ND B1, IB H120",
  }
  

  // keep a static reference for previous record display
  const previousRecord = useRef(defaultValues).current

  const form = useForm<RecordFormValues>({ defaultValues })

  function onSubmit(values: RecordFormValues) {
    const meds = values.medications
      .split(",")
      .filter((n) => n.trim())
      .map((name) => ({
        name: name.trim(),
        slug: name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),
      }))
    const vaxes = values.vaccinations
      .split(",")
      .filter((n) => n.trim())
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
    <main className="grid grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Previous record details */}
      <Card className="h-full shadow-sm">
        <CardHeader>
          <CardTitle>Previous Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="font-medium">Date:</dt>
            <dd>{previousRecord.date}</dd>

            <dt className="font-medium">Day Age:</dt>
            <dd>{previousRecord.day_age}</dd>

            <dt className="font-medium">Week Age:</dt>
            <dd>{previousRecord.week_age}</dd>

            <dt className="font-medium">Feeds (g):</dt>
            <dd>{previousRecord.feeds_grams}</dd>

            <dt className="font-medium">Dead:</dt>
            <dd>{previousRecord.dead}</dd>

            <dt className="font-medium">Previous Population:</dt>
            <dd>{previousRecord.previous_population}</dd>

            <dt className="font-medium">Current Population:</dt>
            <dd>{previousRecord.current_population}</dd>

            <dt className="font-medium">Medications:</dt>
            <dd>{previousRecord.medications || "—"}</dd>

            <dt className="font-medium">Vaccinations:</dt>
            <dd>{previousRecord.vaccinations || "—"}</dd>
          </dl>
        </CardContent>
      </Card>

      {/* New record form */}
      <div className="col-span-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Add New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                {/* Read-only calculated and prefills */}
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

                {( ["day_age", "week_age", "previous_population", "current_population"] as const ).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {key.replace(/_/g, " ").replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} disabled />
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
                      <FormLabel>Feeds (grams)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Medications</FormLabel>
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
                    <FormItem className="col-span-2">
                      <FormLabel>Vaccinations</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ma5+clone30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="col-span-2 flex justify-end">
                  <Button type="submit">Add Record</Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
