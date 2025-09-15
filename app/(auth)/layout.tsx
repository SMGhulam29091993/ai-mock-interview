import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
