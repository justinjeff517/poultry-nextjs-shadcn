"use client"
import React, { FC } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
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

interface RecordFormValues {
  date: string
  day_age: number
  week_age: number
  previous_population: number
  feeds_grams: number
  dead: number
  current_population: number
  medications: string
  vaccinations: string
}

interface RecordType {
  id: string
  date: string
  day_age: number
  week_age: number
  previous_population: number
  feeds_grams: number
  dead: number
  current_population: number
  medications: { name: string; slug: string }[]
  vaccinations: { name: string; slug: string }[]
}

const dummyRecord: RecordType = {
  id: "1",
  date: "2025-05-05",
  day_age: 7,
  week_age: 1,
  previous_population: 1996,
  feeds_grams: 1575,
  dead: 1,
  current_population: 1995,
  medications: [{ name: "PureTubig", slug: "puretubig" }],
  vaccinations: [{ name: "Ma5+clone30", slug: "ma5clone30" }],
}

const EditRecordPage: FC = () => {
  const router = useRouter()
  const form = useForm<RecordFormValues>({
    defaultValues: {
      date: dummyRecord.date,
      day_age: dummyRecord.day_age,
      week_age: dummyRecord.week_age,
      previous_population: dummyRecord.previous_population,
      feeds_grams: dummyRecord.feeds_grams,
      dead: dummyRecord.dead,
      current_population: dummyRecord.current_population,
      medications: dummyRecord.medications.map(m => m.name).join(", "),
      vaccinations: dummyRecord.vaccinations.map(v => v.name).join(", "),
    },
  })

  const onSubmit: SubmitHandler<RecordFormValues> = values => {
    const meds = values.medications
      .split(",")
      .map(name => ({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      }))
    const vaxes = values.vaccinations
      .split(",")
      .map(name => ({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
      }))

    console.log("Submitted record:", {
      ...values,
      medications: meds,
      vaccinations: vaxes,
    })
    router.back()
  }

  return (
    <main className="grid grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Original Data Panel */}
      <Card className="h-full shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Original Data</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <dt className="text-sm text-gray-600">Date</dt>
            <dd className="font-medium">{dummyRecord.date}</dd>
            <dt className="text-sm text-gray-600">Day Age</dt>
            <dd className="font-medium">{dummyRecord.day_age}</dd>
            <dt className="text-sm text-gray-600">Week Age</dt>
            <dd className="font-medium">{dummyRecord.week_age}</dd>
            <dt className="text-sm text-gray-600">Previous Population</dt>
            <dd className="font-medium">{dummyRecord.previous_population}</dd>
          </dl>
        </CardContent>
      </Card>

      {/* Edit Form Panel */}
      <div className="col-span-2">
        <Card className="shadow-md">
          <CardHeader className="border-b">
            <CardTitle>Edit Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                {/* Read-only fields */}
                {(
                  [
                    { name: "date", type: "date" },
                    { name: "day_age", type: "number" },
                    { name: "week_age", type: "number" },
                    { name: "previous_population", type: "number" },
                    { name: "current_population", type: "number" },
                  ] as const
                ).map(fieldDef => (
                  <FormField
                    key={fieldDef.name}
                    control={form.control}
                    name={fieldDef.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fieldDef.name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type={fieldDef.type}
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* Editable fields */}
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

                {/* Action Buttons */}
                <CardFooter className="col-span-2 flex justify-end space-x-2">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default EditRecordPage