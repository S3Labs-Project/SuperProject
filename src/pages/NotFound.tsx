import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center grain-overlay relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="relative text-center px-4 sm:px-6 section-reveal max-w-md mx-auto">
        <p className="font-display text-6xl sm:text-8xl md:text-9xl font-bold gradient-text leading-none">404</p>
        <h1 className="mt-4 font-display text-lg sm:text-xl md:text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-xl gradient-bg px-5 sm:px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity min-h-[44px] w-full sm:w-auto"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
