import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/40">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg">
              <Rocket className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="gradient-text">superproject</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The premier directory for projects built by Superteam members on Solana.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold text-sm">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore Projects</Link>
            <Link to="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit Project</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold text-sm">Community</h4>
          <div className="flex flex-col gap-2">
            <a href="https://superteam.fun" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Superteam</a>
            <a href="https://solana.com" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solana</a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold text-sm">Social</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter / X</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discord</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2024 superproject.fun — Built with 💜 by the Superteam community
      </div>
    </div>
  </footer>
);

export default Footer;
