import { notFound } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080B12] px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-violet-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-2">Anime Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
