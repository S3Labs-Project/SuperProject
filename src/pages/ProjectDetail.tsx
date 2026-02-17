import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star, Users, Eye, BadgeCheck, Trophy, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/providers/ProjectsProvider";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === id);
  const similar = projects.filter((p) => p.id !== id && p.category === project?.category).slice(0, 3);

  if (!project) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl sm:text-5xl mb-4" aria-hidden>😕</p>
        <p className="font-display font-semibold text-lg sm:text-xl">Project not found</p>
        <Link to="/explore" className="text-primary text-sm sm:text-base mt-2 inline-block">← Back to explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors group py-1">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 shrink-0" aria-hidden /> Back to Explore
        </Link>

        <div className="flex flex-col gap-6 lg:gap-10 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            <div className="glass-card p-4 sm:p-6 md:p-8 section-reveal">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-secondary/80 text-2xl sm:text-3xl ring-1 ring-border/50">
                  {project.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{project.name}</h1>
                    {project.verified && <BadgeCheck className="h-5 w-5 text-primary shrink-0" aria-hidden />}
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-accent">
                      {project.stage}
                    </span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground">{project.tagline}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.website && (
                  <a href={project.website} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gradient-bg border-0 text-white hover:opacity-90 hover:scale-[1.02] transition-transform">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Website
                    </Button>
                  </a>
                )}
                {project.twitter && (
                  <a href={project.twitter} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="hover:border-primary/40">Twitter / X</Button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="hover:border-primary/40"><Github className="mr-1.5 h-3.5 w-3.5" /> GitHub</Button>
                  </a>
                )}
              </div>

              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">About</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{project.description}</p>
              </div>

              {/* Founders */}
              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">Team</h2>
                <div className="flex flex-wrap gap-3">
                  {project.founders.map((founder) => (
                    <div key={founder.name} className="flex items-center gap-3 rounded-xl bg-secondary/80 p-3 border border-border/50 hover:border-primary/20 transition-colors min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-bg text-xs font-bold text-white">
                        {founder.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{founder.name}</p>
                        <p className="text-xs text-muted-foreground">{founder.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-4 lg:w-72 lg:sticky lg:top-24 lg:self-start">
            <div className="section-reveal animation-delay-100">
              <div className="glass-card p-4 sm:p-5 text-center">
                <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl gradient-bg">
                  <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-white" aria-hidden />
                </div>
                <p className="mt-3 font-display text-2xl sm:text-3xl font-bold">{project.score}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Project Score</p>
              </div>
            </div>

            <div className="glass-card divide-y divide-border section-reveal animation-delay-200">
              {[
                { icon: Star, label: "Stars", value: project.stars },
                { icon: Users, label: "Followers", value: project.followers.toLocaleString() },
                { icon: Eye, label: "Users", value: project.users.toLocaleString() },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between p-3 sm:p-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <m.icon className="h-4 w-4 shrink-0" aria-hidden /> {m.label}
                  </span>
                  <span className="font-display font-semibold text-sm sm:text-base">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-4 sm:p-5 space-y-3 section-reveal animation-delay-300">
              <h3 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider">Details</h3>
              {[
                { label: "Chapter", value: project.chapter },
                { label: "Hackathon", value: project.hackathon },
                { label: "Added", value: new Date(project.createdAt).toLocaleDateString() },
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-sm gap-2">
                  <span className="text-muted-foreground shrink-0">{d.label}</span>
                  <span className="font-medium text-right truncate">{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-5">Similar Projects</h2>
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
              {similar.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
