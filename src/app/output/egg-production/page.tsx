// EggProductionPage.tsx
"use client"

import { NextPage } from "next"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Raw data with separate `value` and `unit`
const rawData = {
    previousDay: [
      { label: "[1] Date", value: "2020-11-11", unit: "", isInput: false },
      { label: "[2] Dead Birds", value: 120, unit: "birds", isInput: false },
      { label: "[3] Culled Birds", value: 15, unit: "birds", isInput: false },
      { label: "[4] Total Birds", value: 4200, unit: "birds", isInput: false },
      { label: "[5] Feeds", value: 9.5, unit: "sacks", isInput: false },
      { label: "[6] Feeds", value: 95000, unit: "g", isInput: false },
      { label: "[7] Eggs", value: 1000, unit: "trays", isInput: false },
      { label: "[8] Extra Eggs", value: 15, unit: "pcs", isInput: false },
      { label: "[9] Production", value: 100, unit: "%", isInput: false },
      { label: "[10] Medications", value: "Vitamin A", unit: "", isInput: false },
    ],
    currentDay: [
      { label: "[1] Date", id: "currentDate", value: "2020-11-12", placeholder: "", unit: "", isInput: false },
      { label: "[2] Dead Birds", id: "deadBirds", value: "", placeholder: "0", unit: "birds", isInput: true },
      { label: "[3] Culled Birds", id: "culledBirds", value: "", placeholder: "0", unit: "birds", isInput: true },
      { label: "[4] Total Birds", value: 4160, unit: "birds", isInput: false },
      { label: "[5] Feeds", id: "feedsSacks", value: "", placeholder: "0", unit: "sacks", isInput: true },
      { label: "[6] Feeds", value: 41160, unit: "g", isInput: false },
      { label: "[7] Eggs", id: "eggsTrays", value: "", placeholder: "0", unit: "trays", isInput: true },
      { label: "[8] Extra Eggs", id: "extraEggs", value: "", placeholder: "0", unit: "pcs", isInput: true },
      { label: "[9] Production", value: 85, unit: "%", isInput: false },
      { label: "[10] Medications", id: "medications", value: "", placeholder: "e.g., Vaccines", unit: "", isInput: true },
    ],
  }
  

const EggProductionPage: NextPage = () => {
  const { previousDay, currentDay } = rawData

  // helper to pick input type
  const getInputType = (id?: string) => {
    if (!id) return "text"
    if (id.toLowerCase().includes("date")) return "date"
    if (id === "medications") return "text"
    return "number"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Previous Day Data */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Previous Day
              </h2>
            </CardTitle>
            <CardDescription>
              <blockquote className="italic">
                Previous Day means the day before you entered data for.
              </blockquote>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {previousDay.map((item) => (
              <p key={item.label} className="my-1.5">
                {item.label}:{" "}
                <strong>
                  {item.value}
                  {item.unit && ` ${item.unit}`}
                </strong>
              </p>
            ))}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Fetched from DB</p>
          </CardFooter>
        </Card>

        {/* Current Day Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Current Day
              </h2>
            </CardTitle>
            <CardDescription>
              <blockquote className="italic">
                Current Day means the day you are entering data for.
              </blockquote>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentDay.map((item) =>
              item.isInput ? (
                <div key={item.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Label htmlFor={item.id!}>
                      {item.label}
                      {item.unit && ` (${item.unit})`}
                    </Label>
                    <Input
                      id={item.id!}
                      type={getInputType(item.id)}
                      placeholder={item.placeholder}
                    />
                  </div>
                </div>
              ) : (
                <p key={item.label} className="my-2">
                  {item.label}:{" "}
                  <strong>
                    {item.value}
                    {item.unit && ` ${item.unit}`}
                  </strong>
                </p>
              )
            )}
          </CardContent>
        <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Validate</Button>
        <Button>Submit</Button>
        </CardFooter>

        </Card>
      </div>
    </div>
  )
}

export default EggProductionPage
