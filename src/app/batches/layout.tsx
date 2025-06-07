import * as React from "react"

export default function GrowerLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (

     <div className="p-4">

            {children}
        </div>

    )


  }