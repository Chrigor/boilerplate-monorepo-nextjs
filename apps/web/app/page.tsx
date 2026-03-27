"use client";

import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-brand-secondary-025">
      <h1 className="text-3xl font-bold tracking-tight">
        Boilerplate
      </h1>

      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-wrap gap-6 justify-center">
          <Button>Default</Button>
          <Button>Blue</Button>
        </div>
      </div>
    </main>
  );
}
