"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

import { DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage, logout } from "@/features/authSlice";
import {
  BellIcon,
  ClipboardCheckIcon,
  ClipboardEditIcon,
  MenuIcon,
  PowerIcon,
  SquarePenIcon,
  WorkflowIcon,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [userLoaded, setUserLoaded] = useState(false);
  const initRef = useRef(false);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    dispatch(loadUserFromStorage()).finally(() => {
      setUserLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (userLoaded && !user) {
      router.push("/");
    }
  }, [user, userLoaded, router]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = [
    { href: "/dashboard", label: "My Tasks" },
    { href: "/assigned", label: "Received Tasks" },
    { href: "/create", label: "Create Task" },
    { href: "/notifications", label: "Notifications" },
  ];

  const getIcon = (link) => {
    var icon = <MenuIcon className="h-5 w-5" />;
    switch (link) {
      case "/dashboard":
        icon = <ClipboardEditIcon className="h-5 w-5" />;
        break;
      case "/assigned":
        icon = <ClipboardCheckIcon className="h-5 w-5" />;
        break;
      case "/create":
        icon = <SquarePenIcon className="h-5 w-5" />;
        break;
      case "/notifications":
        icon = <BellIcon className="h-5 w-5" />;
        break;
    }
    return icon;
  };
  const SidebarContent = () => (
    <nav className="flex flex-col flex-1 px-2 py-6 space-y-2">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex gap-2 items-center block rounded-md px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            pathname === href ? "bg-gray-700 text-white" : "text-gray-300"
          }`}
        >
          {getIcon(href)} {label}
        </Link>
      ))}
      {user && (
        <div className="mt-auto">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-pink-500 text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-900 text-white">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-left text-red-400 cursor-pointer py-2 rounded-md transition-colors flex items-center ml-0 mt-4"
          >
            <PowerIcon className="inline mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 shadow-lg text-gray-200 fixed h-full">
        <Link
          href="/dashboard"
          className="flex h-16 items-center px-6 border-b border-gray-700 cursor-pointer"
        >
          <Image
            src="/logo.svg"
            alt="TASKY Logo"
            width={32}
            height={32}
            priority
          />
          <span className="ml-3 text-2xl font-bold text-pink-600">TASKY</span>
        </Link>
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
          <DialogTitle></DialogTitle>

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
      <main className="flex-1 p-6 bg-white overflow-auto md:ml-64">
        {children}
      </main>
    </div>
  );
}
