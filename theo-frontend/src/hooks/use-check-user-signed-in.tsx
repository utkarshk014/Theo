"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { ReactNode } from "react";

const HideNavIfNotSignedIn: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isSignedIn } = useUser();
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <>{children}</>;
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
};

export default HideNavIfNotSignedIn;
