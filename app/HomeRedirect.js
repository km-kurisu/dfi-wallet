"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function HomeRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      // If user is already logged in, redirect to profile
      router.push('/profile');
    }
  }, [user, loading, router]);
  
  // This component doesn't render anything, just handles redirection
  return null;
}
