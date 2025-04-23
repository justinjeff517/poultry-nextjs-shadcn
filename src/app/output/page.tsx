import { NextPage } from "next"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconShoppingCart,
  IconReceipt2,
  IconEggs
} from "@tabler/icons-react"

interface Module {
  title: string
  desc: string
  href: string
  icon: any
}

const modules: Module[] = [
  {
    title: "Egg Production",
    desc: "Create and manage POs",
    href: "/output/egg-production",
    icon: IconEggs,
  },
  {
    title: "Sales",
    desc: "Track orders & invoices",
    href: "/output/sales",
    icon: IconReceipt2,
  }
]

const Page: NextPage = () => (
  <div className="p-4">
    <h2 className="mb-4 text-2xl font-semibold">
        Output
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {modules.map((mod) => {
        const Icon = mod.icon
        return (
          <Card key={mod.title}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <div>
                  <CardTitle>{mod.title}</CardTitle>
                  <CardDescription>{mod.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Outputs for {mod.title}</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={mod.href}>Go to {mod.title}</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  </div>
)

export default Page
