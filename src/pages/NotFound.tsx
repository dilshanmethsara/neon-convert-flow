import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <FileX className="h-20 w-20 text-neonBlue animate-pulse-glow" />
          </div>
          <h1 className="text-7xl font-bold text-glow">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
          <Button 
            asChild
            className="bg-neonBlue hover:bg-neonBlue/80 text-black btn-glow"
          >
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
