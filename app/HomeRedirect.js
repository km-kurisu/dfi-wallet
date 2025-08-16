"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function HomeRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);
  
  useEffect(() => {
    // Only redirect once, and only from the exact home page path
    // This allows users to navigate back to home after initial redirect
    if (!loading && user && pathname === "/" && !hasRedirected) {
      // Store that we've done the initial redirect
      setHasRedirected(true);
      
      // Get user's preferred homepage from their profile data
     
    }
  }, [user, loading, router, pathname, hasRedirected]);
  
  // This component doesn't render anything, just handles redirection
  return null;
}
