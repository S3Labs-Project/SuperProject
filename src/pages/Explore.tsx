import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from "@/components/ProjectCard";
import { mockProjects, categories, stages, chapters, hackathons } from "@/data/mockData";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [chapter, setChapter] = useState("All");
  const [hackathon, setHackathon] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockProjects];
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
  }, [search, sort, category, stage, chapter, hackathon]);

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-secondary border-border h-9 text-sm">
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
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Explore Projects</h1>
          <p className="mt-1 text-muted-foreground">Browse {mockProjects.length}+ projects from the Superteam ecosystem</p>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary border-border pl-10 h-11"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 bg-secondary border-border h-11">
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
            className="flex h-11 items-center gap-2 rounded-lg border border-border bg-secondary px-4 text-sm font-medium transition-colors hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-56 shrink-0 space-y-4 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="glass-card p-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">Filters</h3>
              <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
              <FilterSelect label="Stage" value={stage} onChange={setStage} options={stages} />
              <FilterSelect label="Chapter" value={chapter} onChange={setChapter} options={chapters} />
              <FilterSelect label="Hackathon" value={hackathon} onChange={setHackathon} options={hackathons} />
            </div>
          </aside>

          {/* Project Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-display font-semibold">No projects found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
