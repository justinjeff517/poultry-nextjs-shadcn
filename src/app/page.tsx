"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">JEF Poultry</h1>
          <nav className="space-x-4">
            <Link href="/growers" className="text-blue-600 hover:underline">
              Growers
            </Link>
            <Link href="/about" className="text-gray-600 hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <h2 className="text-4xl font-extrabold mb-4">
            Welcome to JEF Poultry Dashboard
          </h2>
          <p className="text-lg mb-6">
            Manage your flocks, track batches, and streamline operations all from one place.
          </p>
          <Button asChild className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <Link href="/growers">Go to Growers</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2025 JEF Poultry. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
