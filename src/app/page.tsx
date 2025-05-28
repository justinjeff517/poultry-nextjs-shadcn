import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page(): JSX.Element {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Please Sign In</CardTitle>
          <CardDescription>
            Access your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Could add form inputs here if using custom auth */}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Sign In</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
