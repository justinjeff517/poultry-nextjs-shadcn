export default function VaccinationLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          {/* Layout UI */}
          {/* Place children where you want to render a page or nested layout */}
          <p>Layout Page</p>
          <main>{children}</main>
        </body>
      </html>
    )
  }