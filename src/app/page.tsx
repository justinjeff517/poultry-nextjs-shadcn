"use client"
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function HomePage() {
  return (
       <div className="p-4 space-y-6">
          <div className="text-center max-w-xl mx-auto py-10">
            <h2 className="text-4xl font-extrabold mb-4">
              Welcome to JEF Poultry Dashboard
            </h2>
            <p className="text-lg mb-6">
              Manage your flocks, track batches, and streamline operations all from one place.
            </p>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/growers">Go to Growers</Link>
            </Button>
          </div>
          <SectionCards />
          <ChartAreaInteractive />
        </div>
  )
}
