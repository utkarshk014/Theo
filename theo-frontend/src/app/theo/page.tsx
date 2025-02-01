"use client";

import GlowTextInputSignedOut from "@/components/SignedOutInput";
import { TheoBrainLogoThinking, TheoLogoBig } from "@/components/Theo";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton, SignedOut, useAuth } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      redirect("/");
    }
  }, [userId]);

  useEffect(() => {
    // Close both mobile and desktop sidebars when on /theo route
    if (pathname === "/theo") {
      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }
    }
  }, [pathname, setOpen, setOpenMobile, isMobile]);

  return (
    <div>
      <div className="w-full  flex flex-col items-center justify-center h-[80vh]">
        <div className="z-10 mb-10">
          <div className="flex justify-center items-center gap-5">
            <TheoLogoBig />
            <TheoBrainLogoThinking />
          </div>
          <div className="text-base mt-5 font-normal text-gray-400">
            Your personal AI finance and investment teacher. I Don&apos;t
            Predict Markets. I Teach Mastery.
          </div>
        </div>
        <AuthButtonWrapper />
      </div>
      <GlowTextInputSignedOut />
    </div>
  );
}

const AuthButtonWrapper = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <SkeletonButton />;
  }

  return (
    <SignedOut>
      <SignInButton mode="modal">
        <button className="bg-white rounded-[10px] text-black px-5 py-2.5 transition-colors">
          Sign up / Sign in
        </button>
      </SignInButton>
    </SignedOut>
  );
};

const SkeletonButton = () => (
  <Skeleton className="h-10 w-40 rounded-[10px] bg-gray-200 animate-pulse" />
);
