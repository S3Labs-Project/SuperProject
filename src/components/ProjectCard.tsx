import { Star, Users, Eye, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Link
    to={`/project/${project.id}`}
    className="glass-card hover-lift flex h-[176px] w-full min-w-0 flex-col rounded-xl p-4 sm:p-5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <div className="flex min-h-0 flex-1 items-start gap-3 sm:gap-4">
      <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-secondary/80 text-xl sm:text-2xl ring-1 ring-border/50 group-hover:ring-primary/30 transition-all duration-300">
        {project.logo}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-base sm:text-lg text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {project.name}
          </h3>
          {project.verified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3 leading-snug group-hover:text-muted-foreground/90 transition-colors overflow-hidden text-ellipsis">
          {project.tagline}
        </p>
      </div>
    </div>
    <div className="mt-3 sm:mt-4 flex shrink-0 items-center justify-between gap-2">
      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20 truncate max-w-[120px] sm:max-w-[140px]">
        {project.category}
      </span>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Star className="h-3 w-3 shrink-0" aria-hidden /> {project.stars}
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Users className="h-3 w-3 shrink-0" aria-hidden /> {project.followers}
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <Eye className="h-3 w-3 shrink-0" aria-hidden /> {project.users.toLocaleString()}
        </span>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
