import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {batches.map((batch) => (
        <Card key={batch.slug}>
          <CardHeader>
            <CardTitle>{batch.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Breed: {batch.breed}</p>
            <Button asChild className="mt-4">
              <Link href={`/layers/${batch.slug}`}>Select</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
