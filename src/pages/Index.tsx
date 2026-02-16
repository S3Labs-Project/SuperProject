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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full gradient-bg animate-pulse-glow" />
              Product Hunt for Solana Superteam
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl animate-fade-in">
              Discover what{" "}
              <span className="gradient-text">Superteam</span>{" "}
              is building
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Explore the best projects built by Superteam members on Solana. Submit your project, get discovered, and grow with the community.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/submit">
                <Button size="lg" className="gradient-bg border-0 px-8 font-semibold text-background hover:opacity-90 h-12">
                  Submit Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="outline" className="px-8 h-12 border-border hover:bg-secondary">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-glow flex flex-col items-center gap-2 py-4 text-center">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="font-display text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">🔥 Trending Projects</h2>
              <p className="mt-1 text-sm text-muted-foreground">Most popular this week</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4">
            {trendingProjects.map((project) => (
              <div key={project.id} className="min-w-[300px] max-w-[340px] shrink-0">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">🆕 Recently Added</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fresh from the community</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
