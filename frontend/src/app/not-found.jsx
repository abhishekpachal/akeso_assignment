"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
      <Ghost className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link href="/" passHref>
        <Button className="mt-6">Go Home</Button>
      </Link>
    </div>
  );
}
