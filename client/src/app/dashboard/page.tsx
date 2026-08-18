"use client";

import { AuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/use.auth";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { user } = AuthStore();
  const { logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="p-8 rounded-xl bg-background-card border border-border text-center">
        <p className="text-gray-400">
          🚧 Full dashboard with stats, recent reviews, and the code editor
          will be built on Day 7 & Day 11.
        </p>
      </div>
    </div>
  );
}



