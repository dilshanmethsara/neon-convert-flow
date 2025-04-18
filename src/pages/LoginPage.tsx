
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Layout } from "@/components/layout/Layout";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
}
