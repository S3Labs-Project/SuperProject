import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/providers/ProjectsProvider";
import { categories, stages, chapters, hackathons } from "@/data/mockData";

const Explore = () => {
  const { projects } = useProjects();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [chapter, setChapter] = useState("All");
  const [hackathon, setHackathon] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (stage !== "All") result = result.filter((p) => p.stage === stage);
    if (chapter !== "All") result = result.filter((p) => p.chapter === chapter);
    if (hackathon !== "All") result = result.filter((p) => p.hackathon === hackathon);

    if (sort === "popular") result.sort((a, b) => b.stars - a.stars);
    else if (sort === "recent") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sort === "trending") result = result.filter((p) => p.trending).concat(result.filter((p) => !p.trending));

    return result;
  }, [projects, search, sort, category, stage, chapter, hackathon]);

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="mb-1.5 block text-xs sm:text-sm font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-secondary border-border h-11 min-h-[44px] sm:h-9 sm:min-h-0 text-sm w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Explore Projects</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Browse {projects.length}+ projects from the Superteam ecosystem</p>
        </div>

        {/* Search bar */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0" aria-hidden />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/80 border-border pl-10 h-11 sm:h-12 rounded-xl text-base sm:text-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow w-full"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-44 bg-secondary/80 border-border h-11 sm:h-12 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/30 lg:hidden min-h-[44px]"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-56 shrink-0 space-y-4 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="glass-card p-4 sm:p-5 space-y-4 lg:sticky lg:top-24">
              <h3 className="font-display font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground">Filters</h3>
              <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
              <FilterSelect label="Stage" value={stage} onChange={setStage} options={stages} />
              <FilterSelect label="Chapter" value={chapter} onChange={setChapter} options={chapters} />
              <FilterSelect label="Hackathon" value={hackathon} onChange={setHackathon} options={hackathons} />
            </div>
          </aside>

          {/* Project Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project, i) => (
                  <div
                    key={project.id}
                    className="section-reveal min-w-0"
                    style={{ animationDelay: `${Math.min(i * 40, 320)}ms`, animationFillMode: "backwards" }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center section-reveal px-4">
                <div className="text-4xl sm:text-5xl mb-4 opacity-80" aria-hidden>🔍</div>
                <p className="font-display font-semibold text-base sm:text-lg">No projects found</p>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Try adjusting your filters or search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
