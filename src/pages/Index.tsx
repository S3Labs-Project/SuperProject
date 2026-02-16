import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { mockProjects } from "@/data/mockData";

const stats = [
  { label: "Total Projects", value: "420+", icon: Sparkles },
  { label: "Active Builders", value: "1,200+", icon: Zap },
  { label: "Hackathon Wins", value: "85+", icon: TrendingUp },
];

const Index = () => {
  const trendingProjects = mockProjects.filter((p) => p.trending);
  const recentProjects = mockProjects.slice(0, 6);

  return (
    <div className="min-h-screen grain-overlay">
      {/* Hero — purple gradient in dark, subtle in light */}
      <section className="relative z-0 overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark: deep purple gradient; Light: soft purple tint */}
          <div className="absolute inset-0 dark:hero-gradient opacity-100 bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent dark:from-transparent dark:via-transparent dark:to-transparent" />
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/4 translate-x-1/4 dark:bg-primary/20" />
          <div className="absolute bottom-0 left-0 h-[350px] w-[400px] rounded-full bg-primary/6 blur-[100px] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:opacity-50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground backdrop-blur-sm animate-fade-in dark:bg-card/40">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">Product Hunt for Solana Superteam</span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl animate-fade-in animation-delay-100 dark:text-white">
              Discover what{" "}
              <span className="gradient-text">Superteam</span>{" "}
              is building
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-200 dark:text-white/80">
              Explore the best projects built by Superteam members on Solana. Submit your project, get discovered, and grow with the community.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row animate-fade-in-up animation-delay-300">
              <Link to="/submit" className="w-full sm:w-auto">
                <Button size="lg" className="gradient-bg border-0 px-6 sm:px-8 font-semibold text-white hover:opacity-90 hover:scale-[1.02] h-11 sm:h-12 w-full sm:w-auto text-base transition-transform duration-200">
                  Submit Project
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </Link>
              <Link to="/explore" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto text-base border-border hover:bg-secondary hover:border-primary/30 transition-colors duration-200">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — staggered reveal */}
      <section className="border-y border-border bg-card/40 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-glow flex flex-col items-center gap-2 py-4 text-center section-reveal"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden />
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending — horizontal scroll with stagger */}
      <section className="py-12 sm:py-16 md:py-24 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Trending Projects</h2>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">Most popular this week</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:text-accent transition-colors shrink-0">
              View all →
            </Link>
          </div>
          <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex gap-4 sm:gap-5 w-max animate-marquee py-2">
              {[...trendingProjects, ...trendingProjects].map((project, i) => (
                <div
                  key={`${project.id}-${i}`}
                  className="w-[300px] shrink-0"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added — asymmetric grid */}
      <section className="pb-16 sm:pb-24 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Recently Added</h2>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">Fresh from the community</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:text-accent transition-colors shrink-0">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project, i) => (
              <div
                key={project.id}
                className="section-reveal min-w-0"
                style={{ animationDelay: `${200 + i * 70}ms`, animationFillMode: "backwards" }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
