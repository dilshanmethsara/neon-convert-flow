
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Video, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-lg border-b border-white/10">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Video className="h-6 w-6 text-neonBlue animate-pulse-glow" />
            <span className="font-bold text-xl md:text-2xl tracking-tight text-glow hidden sm:inline-block">
              H265X to MP4 Converter
            </span>
            <span className="font-bold text-xl tracking-tight text-glow sm:hidden">
              H265X Converter
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium transition-colors hover:text-neonBlue"
              >
                Dashboard
              </Link>
              <Link 
                to="/donate" 
                className="text-sm font-medium transition-colors hover:text-neonBlue flex items-center gap-1"
              >
                Donate <Heart className="h-4 w-4 text-red-500" />
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-sm font-medium transition-colors hover:text-neonBlue"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium transition-colors hover:text-neonBlue"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium transition-colors hover:text-neonBlue"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass p-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium transition-colors hover:text-neonBlue p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/donate" 
                  className="text-sm font-medium transition-colors hover:text-neonBlue p-2 flex items-center gap-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate <Heart className="h-4 w-4 text-red-500" />
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-neonBlue justify-start p-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium transition-colors hover:text-neonBlue p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-sm font-medium transition-colors hover:text-neonBlue p-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
