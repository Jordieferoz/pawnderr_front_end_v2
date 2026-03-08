export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-90px)]">
      <div className="container mx-auto min-h-[calc(100vh-90px)] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
