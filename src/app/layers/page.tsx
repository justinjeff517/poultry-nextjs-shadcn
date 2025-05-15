"use client"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

type Batch = {
  name: string
  slug: string
  breed: string
}

const batches: Batch[] = [
  { name: "Alpha Batch", slug: "alpha-batch", breed: "Leghorn" },
  { name: "Beta Batch",  slug: "beta-batch",  breed: "Rhode Island Red" },
  { name: "Gamma Batch", slug: "gamma-batch", breed: "Plymouth Rock" },
  { name: "Delta Batch", slug: "delta-batch", breed: "Sussex" },
  { name: "Epsilon Batch", slug: "epsilon-batch", breed: "Orpington" },
  { name: "Zeta Batch",  slug: "zeta-batch",  breed: "Wyandotte" },
]

export default function Page() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Layer Flocks</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search batches…"
            className="pl-10 pr-4 py-2 border rounded-full focus:ring focus:outline-none"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch, i) => (
          <Card
            key={batch.slug}
            className={`overflow-hidden rounded-2xl shadow-md transition-transform duration-200 
              hover:scale-[1.02] ${i % 2 === 0 ? "bg-gradient-to-tr from-white to-gray-50" : "bg-white"}`}
          >
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">{batch.name}</CardTitle>
              <Badge className="mt-1">{batch.breed}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <p className="text-sm text-gray-600">ID: <span className="font-mono">{batch.slug}</span></p>
              <Button asChild className="mt-4 self-end">
                <Link href={`/layers/${batch.slug}`} className="px-4 py-2">
                  Manage
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
