import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Ushuari",
  description: "Sign in or register for Ushuari legal assistance platform",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
