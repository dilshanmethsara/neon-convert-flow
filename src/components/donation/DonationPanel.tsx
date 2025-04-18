
import { Heart, DollarSign, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DonationPanel() {
  return (
    <Card className="glass border-none w-full max-w-xl mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Heart className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Support this project 💖</CardTitle>
        <CardDescription>
          Help keep this converter free and support future development
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex justify-center mb-4">
              <DollarSign className="h-8 w-8 text-neonBlue" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">PayPal</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Support with a one-time donation via PayPal
            </p>
            <Button 
              className="w-full bg-neonBlue hover:bg-neonBlue/80 text-black btn-glow"
              onClick={() => window.open("https://paypal.me/", "_blank")}
            >
              Donate with PayPal
            </Button>
          </div>
          
          <div className="glass rounded-xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex justify-center mb-4">
              <Bitcoin className="h-8 w-8 text-electricGreen" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">Crypto</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Support with cryptocurrency donations
            </p>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-2 rounded-lg w-32 h-32 mx-auto">
                {/* QR code image would go here - using placeholder for demo */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground break-all">
              bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
            </p>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Your support helps keep this tool free and allows for continued improvements!</p>
          <p className="mt-2">Thank you for your generosity ❤️</p>
        </div>
      </CardContent>
    </Card>
  );
}
