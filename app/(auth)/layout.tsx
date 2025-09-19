import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const isAuthenticate = await isAuthenticated();
  if (isAuthenticate) redirect("/");
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
