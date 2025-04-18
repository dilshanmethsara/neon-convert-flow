
import { Layout } from "@/components/layout/Layout";
import { DonationPanel } from "@/components/donation/DonationPanel";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DonatePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-6xl mx-auto py-10 px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-3 text-glow">Support the Project</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your donations help keep this service free and support future development and server costs.
            </p>
          </div>
          
          <DonationPanel />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
