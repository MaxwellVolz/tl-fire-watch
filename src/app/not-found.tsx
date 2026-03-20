import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">Page not found.</p>
      <Link
        href="/"
        className="mt-4 text-primary-400 underline-offset-4 hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
