import React from "react";

interface RootLayoutProps {
  children?: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return <div>{children}</div>;
};

export default RootLayout;
