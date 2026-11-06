import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </div>
  );
}
