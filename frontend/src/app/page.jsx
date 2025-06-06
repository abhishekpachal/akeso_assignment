"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage, loginUser } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import Toast from "@/lib/Toast";
import { hideLoader, showLoader } from "@/features/loaderSlice";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("abhishek.pachal@gmail.com");
  const [password, setPassword] = useState("123456");
  const [userLoaded, setUserLoaded] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    dispatch(loadUserFromStorage()).finally(() => setUserLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (userLoaded && user) {
      router.push("/dashboard");
    }
  }, [user, userLoaded]);

  useEffect(() => {
    if (loading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      Toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-120 rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="mb-5 mt-5 flex justify-center">
          <img src="/logo.svg" alt="Logo" className="h-15 w-auto" />
          <Label className="text-4xl text-pink-400">TASKY</Label>
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            className={"mt-3"}
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
            className={"mt-3"}
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Log In
        </Button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
