import { Link } from "wouter";
import { ArrowLeft, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <Car className="h-12 w-12 text-muted-foreground opacity-50" />
        </div>
        
        <h1 className="font-display text-6xl font-bold text-primary">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Page not found</h2>
          <p className="text-muted-foreground">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="mt-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
