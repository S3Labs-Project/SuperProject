import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 relative z-10 pb-[env(safe-area-inset-bottom)]">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4 sm:col-span-2 md:col-span-1 md:max-w-xs">
          <Link to="/" className="inline-flex items-center gap-2 sm:gap-2.5 font-display text-base sm:text-lg font-bold group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg transition-transform duration-200 group-hover:scale-105 shrink-0">
              <Rocket className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="gradient-text">superproject</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            The premier directory for projects built by Superteam members on Solana.
          </p>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-display font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground">Platform</h4>
          <div className="flex flex-col gap-2 sm:gap-3">
            <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Explore Projects</Link>
            <Link to="/submit" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Submit Project</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-display font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground">Community</h4>
          <div className="flex flex-col gap-2 sm:gap-3">
            <a href="https://superteam.fun" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Superteam</a>
            <a href="https://solana.com" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Solana</a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 sm:mb-4 font-display font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground">Social</h4>
          <div className="flex flex-col gap-2 sm:gap-3">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Twitter / X</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">Discord</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors w-fit py-2 sm:py-0.5 min-h-[44px] sm:min-h-0 flex items-center">GitHub</a>
          </div>
        </div>
      </div>
      <div className="mt-10 sm:mt-12 border-t border-border pt-6 text-center text-xs sm:text-sm text-muted-foreground">
        © 2026 superproject.fun — Built with 💜 by the Superteam - S3Labs
      </div>
    </div>
  </footer>
);

export default Footer;
