import type { Metadata } from "next";
import ThemeToggle from "@/app/components/blog/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "zeph's blog",
  description: "personal blog",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      {children}
      <ThemeToggle />
    </div>
  );
}
