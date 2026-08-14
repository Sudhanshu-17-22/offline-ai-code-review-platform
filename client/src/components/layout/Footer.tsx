export default function Footer() {
  return (
    <footer className="border-t border-border bg-background-card">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Offline AI Code Review Platform.
            All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Privacy-first. AI-powered. Fully offline.
          </p>
        </div>
      </div>
    </footer>
  );
}
