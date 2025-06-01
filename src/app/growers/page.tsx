// app/growers/page.tsx
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type BatchData = {
  batch_id: string
  name: string
  slug: string
  breed: string
  flock_type: "layer" | "broiler" | "breeder"
  start_date: string
  initial_population: number
  status: "active" | "culled" | "sold" | "transferred" | "archived"
  notes?: string
}

type Metadata = {
  mongodb: {
    collection: string
    database: string
  }
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}

type BatchDocument = {
  data: BatchData
  metadata: Metadata
}

async function getBatches(): Promise<BatchData[]> {
  const res = await fetch("http://localhost:3000/api/database/batches/get-batches", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch batches")
  const json: { documents: BatchDocument[] } = await res.json()
  return json.documents.map((doc) => doc.data)
}

export default async function Page() {
  const batches = await getBatches()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {batches.map((batch) => (
        <Card key={batch.batch_id}>
          <CardHeader>
            <CardTitle>{batch.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Breed: {batch.breed}</p>
            <p>Type: {batch.flock_type}</p>
            <p>Start Date: {batch.start_date}</p>
            <p>Population: {batch.initial_population}</p>
            <p>Status: {batch.status}</p>
            {batch.notes && <p>Notes: {batch.notes}</p>}
            <Button asChild className="mt-4">
              <Link href={`/growers/${batch.slug}`}>Select</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
