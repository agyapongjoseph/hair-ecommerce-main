import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in-up max-w-md mx-auto px-4">
        <div className="text-8xl md:text-9xl font-luxury font-bold text-gradient-gold mb-6">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-luxury font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 font-elegant">
          Oops! The page you're looking for doesn't exist. 
          Let's get you back to our beautiful hair collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-glow text-primary-foreground font-elegant font-bold shadow-gold hover-lift group"
          >
            <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Go Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-primary text-primary hover:bg-primary/10 font-elegant font-bold hover-lift group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
