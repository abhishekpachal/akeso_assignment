"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Handle registration logic here
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Password:", password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-120 rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="mb-5 mt-5 flex justify-center">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-15 w-auto"
          />
          <Label className="text-4xl text-pink-400">TASKY</Label>
        </div>


        <div className="mb-4">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            className="mt-3"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            className="mt-3"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            className="mt-3"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}
