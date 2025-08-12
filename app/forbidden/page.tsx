import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">403 — Forbidden</h1>
        <p className="text-muted-foreground">You do not have permission to access this page.</p>
        <Link href="/login">to login</Link>
      </div>
    </div>
  );
}


