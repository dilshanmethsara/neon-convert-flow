
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-6">
        <div className="text-center space-y-6 max-w-3xl animate-fade-in">
          <div className="flex justify-center">
            <Video className="h-16 w-16 text-neonBlue animate-pulse-glow" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
            H265X to MP4 Converter
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Convert your H265X video files to MP4 format with our easy-to-use free online tool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-neonBlue hover:bg-neonBlue/80 text-black font-medium px-8 py-6 text-lg animate-pulse-glow btn-glow"
            >
              Sign In <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg"
            >
              Create Account
            </Button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl mt-8">
            <h2 className="text-lg font-medium text-glow-green">100% Free to Use</h2>
            <p className="text-sm text-muted-foreground mt-2">
              No hidden fees, no watermarks, no limits on file size.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
