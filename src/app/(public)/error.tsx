import Link from "next/link";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080B12] px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-500 mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
