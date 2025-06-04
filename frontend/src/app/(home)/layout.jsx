"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

import { DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname=usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else setIsMounted(true);
  }, [router]);

  if (!isMounted) return null;

  const navLinks = [
    { href: "/dashboard", label: "My Tasks" },
    { href: "/assigned", label: "Received Tasks" },
    { href: "/create", label: "Create Task" }
  ];

  const SidebarContent = () => (
    <nav className="flex flex-col flex-1 p-6 space-y-2">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`block rounded-md px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            pathname === href ? "bg-gray-700 text-white" : "text-gray-300"
          }`}
        >
          {label}
        </Link>
      ))}
      <div className="mt-auto">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-pink-500 text-white">
              {"AP"}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-900 text-white">Abhishek Pachal</span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/");
          }}
          className="text-left text-red-400 hover:bg-red-600 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 shadow-lg text-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-700">
          <Image
            src="/logo.svg"
            alt="TASKY Logo"
            width={32}
            height={32}
            priority
          />
          <span className="ml-3 text-2xl font-bold text-pink-600">TASKY</span>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar using Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
            aria-label="Open menu"
          >
            {/* Hamburger icon */}
            <div className="space-y-1">
              <span className="block h-0.5 w-6 rounded bg-gray-900"></span>
              <span className="block h-0.5 w-6 rounded bg-gray-900"></span>
              <span className="block h-0.5 w-6 rounded bg-gray-900"></span>
            </div>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 p-0 bg-gray-800 text-gray-200"
        >
          <DialogTitle ></DialogTitle>

          <div className="flex items-center px-6 py-4 border-b border-gray-700">
            <Image
              src="/logo.svg"
              alt="TASKY Logo"
              width={32}
              height={32}
              priority
            />
            <span className="ml-3 text-2xl font-bold text-blue-600">TASKY</span>
          </div>

          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <main className="flex-1 p-6 bg-white overflow-auto">{children}</main>
    </div>
  );
}
