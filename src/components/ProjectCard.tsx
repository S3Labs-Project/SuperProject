import { Star, Users, Eye, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Link to={`/project/${project.id}`} className="glass-card hover-lift block p-5 group">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {project.logo}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          {project.verified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-solana-green" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {project.category}
      </span>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" /> {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {project.followers}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" /> {project.users.toLocaleString()}
        </span>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
