
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-white/10">
      <div className="container flex flex-col items-center justify-center px-4 md:px-6 gap-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          Made with <Heart className="h-4 w-4 text-red-500 animate-pulse" /> by Dilshan Methsara
        </p>
        <p>
          Copyright © {currentYear}
        </p>
      </div>
    </footer>
  );
}
