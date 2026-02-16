import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Star, Users, Eye, BadgeCheck, Trophy, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { mockProjects } from "@/data/mockData";

const ProjectDetail = () => {
  const { id } = useParams();
  const project = mockProjects.find((p) => p.id === id);
  const similar = mockProjects.filter((p) => p.id !== id && p.category === project?.category).slice(0, 3);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-4xl mb-4">😕</p>
        <p className="font-display font-semibold">Project not found</p>
        <Link to="/explore" className="text-primary text-sm mt-2 inline-block">← Back to explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
                  {project.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-2xl font-bold md:text-3xl">{project.name}</h1>
                    {project.verified && <BadgeCheck className="h-5 w-5 text-solana-green" />}
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                      {project.stage}
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">{project.tagline}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.website && (
                  <a href={project.website} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gradient-bg border-0 text-background">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Website
                    </Button>
                  </a>
                )}
                {project.twitter && (
                  <a href={project.twitter} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">Twitter / X</Button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline"><Github className="mr-1.5 h-3.5 w-3.5" /> GitHub</Button>
                  </a>
                )}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>

              {/* Founders */}
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold mb-3">Team</h2>
                <div className="flex flex-wrap gap-3">
                  {project.founders.map((founder) => (
                    <div key={founder.name} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-xs font-bold text-background">
                        {founder.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{founder.name}</p>
                        <p className="text-xs text-muted-foreground">{founder.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-4 lg:w-72">
            {/* Score */}
            <div className="glass-card p-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg">
                <Trophy className="h-7 w-7 text-background" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{project.score}</p>
              <p className="text-xs text-muted-foreground">Project Score</p>
            </div>

            {/* Metrics */}
            <div className="glass-card divide-y divide-border">
              {[
                { icon: Star, label: "Stars", value: project.stars },
                { icon: Users, label: "Followers", value: project.followers.toLocaleString() },
                { icon: Eye, label: "Users", value: project.users.toLocaleString() },
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between p-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <m.icon className="h-4 w-4" /> {m.label}
                  </span>
                  <span className="font-display font-semibold">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="font-display text-sm font-semibold">Details</h3>
              {[
                { label: "Chapter", value: project.chapter },
                { label: "Hackathon", value: project.hackathon },
                { label: "Added", value: new Date(project.createdAt).toLocaleDateString() },
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold mb-4">Similar Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
