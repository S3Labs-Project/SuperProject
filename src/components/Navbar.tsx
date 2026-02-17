import { Link, useLocation } from "react-router-dom";
import { Rocket, Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/admin", label: "Admin", icon: LayoutDashboard },
  ];

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200 pt-[env(safe-area-inset-top)]">
      <div className="container relative mx-auto flex h-14 sm:h-16 items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 font-display text-base sm:text-xl font-bold group min-w-0 shrink">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl gradient-bg transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3 shrink-0">
            <Rocket className="h-4 w-4 text-white" aria-hidden />
          </div>
          <span className="gradient-text truncate">superproject</span>
        </Link>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-foreground relative py-1 whitespace-nowrap flex items-center gap-1.5 ${
                location.pathname === link.to ? "text-foreground" : "text-muted-foreground"
              } ${location.pathname === link.to ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary" : ""}`}
            >
              {"icon" in link && link.icon ? <link.icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex shrink-0">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mounted && (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>
          <Link to="/submit">
            <Button size="sm" className="gradient-bg border-0 font-medium text-white hover:opacity-90 hover:scale-[1.02] transition-transform duration-200 text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-5 min-w-[130px] sm:min-w-[145px]">
              Submit Project
            </Button>
          </Link>
          <WalletConnectButton className="h-9 sm:h-10 px-4 sm:px-5 text-sm sm:text-base font-medium min-w-[130px] sm:min-w-[145px]" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:hidden shrink-0">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mounted && (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>
          <button className="text-foreground p-2.5 -m-2 rounded-lg hover:bg-secondary/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top duration-200">
          <div className="container mx-auto flex flex-col gap-1 px-4 sm:px-6 py-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium py-3 px-2 rounded-lg min-h-[44px] flex items-center gap-2 ${
                  location.pathname === link.to ? "text-foreground bg-secondary/50" : "text-muted-foreground"
                } hover:text-foreground hover:bg-secondary/50 transition-colors`}
              >
                {"icon" in link && link.icon ? <link.icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link to="/submit" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="gradient-bg border-0 w-full font-medium text-white h-11 text-base">
                  Submit Project
                </Button>
              </Link>
              <WalletConnectButton className="w-full justify-center h-11 text-base font-medium" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
