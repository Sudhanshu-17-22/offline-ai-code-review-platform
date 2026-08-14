import Link from "next/link";
import { ShieldCheck, Zap, GitBranch, Cpu } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const features = [
    {
      icon: ShieldCheck,
      title: "100% Offline & Private",
      description:
        "Your code never leaves your machine. AI review runs entirely locally via Ollama — no cloud, no data leaks.",
    },
    {
      icon: Zap,
      title: "Real-Time Streaming Analysis",
      description:
        "Watch AI review your code live, with instant feedback powered by WebSockets.",
    },
    {
      icon: GitBranch,
      title: "Static + AI Analysis Combined",
      description:
        "AST parsing and ESLint rules catch deterministic issues, while the LLM catches logic and design flaws.",
    },
    {
      icon: Cpu,
      title: "Multi-Language Support",
      description:
        "Deep analysis for JavaScript/TypeScript, with AI-powered review for Python, Java, C++, and more.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center px-6 pt-24 pb-20 animate-fade-in">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
          🔒 Privacy-First AI Code Review
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Review Code with AI —{" "}
          <span className="text-primary">Without Sending It Anywhere</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          An offline AI-powered code review platform for developers and teams who
          can&apos;t compromise on data privacy. Runs entirely on your machine — no API keys, no cloud, no cost.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="primary" className="px-6 py-3 text-base">
              Get Started Free
            </Button>
          </Link>
          <Link href="/#how-it-works">
            <Button variant="secondary" className="px-6 py-3 text-base">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Why Offline AI Review?</h2>
          <p className="text-gray-400">
            Built for developers who need real AI assistance without compromising security.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-background-card border border-border hover:border-primary/40 transition-colors animate-slide-up"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-14">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Paste or Upload Code", desc: "Drop your code into our Monaco-powered editor." },
            { step: "02", title: "AI Analyzes Locally", desc: "A local LLM + static analyzer review your code offline." },
            { step: "03", title: "Get Actionable Feedback", desc: "See issues, severity, and suggested fixes instantly." },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto text-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-4">Ready to Review Code Privately?</h2>
        <p className="text-gray-400 mb-8">
          No signup fees. No cloud dependency. Just better code, kept private.
        </p>
        <Link href="/register">
          <Button variant="primary" className="px-8 py-3 text-base">
            Start Reviewing Now
          </Button>
        </Link>
      </section>
    </div>
  );
}

