
import { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 pt-16 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
