export default function VaccinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
