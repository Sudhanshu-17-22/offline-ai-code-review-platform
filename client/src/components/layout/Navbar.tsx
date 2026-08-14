import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-primary transition-colors"
        >
          Offline AI Code Review
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>

          <Link
            href="/#how-it-works"
            className="text-gray-300 hover:text-white transition-colors"
          >
            How It Works
          </Link>

          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}



