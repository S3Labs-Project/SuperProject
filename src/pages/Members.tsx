import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Rocket, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProjects } from "@/providers/ProjectsProvider";
import { cn } from "@/lib/utils";

export type MemberWithProjects = {
  name: string;
  role: string;
  avatar: string;
  projectIds: string[];
  projectNames: string[];
};

export function deriveMembersFromProjects(
  projects: { id: string; name: string; founders: { name: string; role: string; avatar: string }[] }[]
): MemberWithProjects[] {
  const byName = new Map<string, MemberWithProjects>();
  for (const project of projects) {
    for (const founder of project.founders) {
      const existing = byName.get(founder.name);
      if (existing) {
        if (!existing.projectIds.includes(project.id)) {
          existing.projectIds.push(project.id);
          existing.projectNames.push(project.name);
        }
      } else {
        byName.set(founder.name, {
          name: founder.name,
          role: founder.role,
          avatar: founder.avatar,
          projectIds: [project.id],
          projectNames: [project.name],
        });
      }
    }
  }
  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
}

const Members = () => {
  const { projects } = useProjects();
  const [search, setSearch] = useState("");

  const allMembers = useMemo(() => deriveMembersFromProjects(projects), [projects]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allMembers;
    const q = search.toLowerCase().trim();
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.projectNames.some((pn) => pn.toLowerCase().includes(q))
    );
  }, [allMembers, search]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl gradient-bg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Superteam Members
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
                People building on projects registered on superproject
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0"
              aria-hidden
            />
            <Input
              placeholder="Search by name, role, or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/80 border-border pl-10 h-11 sm:h-12 rounded-xl text-base sm:text-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow w-full"
            />
          </div>
        </div>

        {/* Member grid */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
          {filtered.length > 0 ? (
            filtered.map((member) => (
              <div
                key={member.name}
                className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors border border-border"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-bg text-sm font-bold text-white">
                    {member.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.projectNames.map((projectName, i) => (
                    <Link
                      key={member.projectIds[i]}
                      to={`/project/${member.projectIds[i]}`}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                        "bg-secondary/80 border border-border hover:border-primary/30 hover:text-primary transition-colors"
                      )}
                    >
                      <Rocket className="h-3 w-3 shrink-0" aria-hidden />
                      <span className="truncate max-w-[120px] sm:max-w-[160px]">
                        {projectName}
                      </span>
                    </Link>
                  ))}
                </div>
                {member.projectIds.length === 1 && (
                  <Link
                    to={`/project/${member.projectIds[0]}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-1"
                  >
                    View project
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full glass-card rounded-2xl p-12 sm:p-16 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" aria-hidden />
              <p className="font-display font-semibold text-foreground">No members match your search</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search or browse projects to see builders
              </p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="mt-6 text-sm text-muted-foreground text-center">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""} building on superproject
          </p>
        )}
      </div>
    </div>
  );
};

export default Members;
