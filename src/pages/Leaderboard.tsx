import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trophy, TrendingUp, ArrowUpDown, Star, ChevronRight, Medal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/providers/ProjectsProvider";
import { cn } from "@/lib/utils";

type SortKey = "stars" | "score" | "recent";

const Leaderboard = () => {
  const { projects } = useProjects();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("stars");

  const ranked = useMemo(() => {
    let list = [...projects].filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tagline.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "stars") list.sort((a, b) => b.stars - a.stars);
    else if (sortBy === "score") list.sort((a, b) => b.score - a.score);
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [projects, search, sortBy]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl gradient-bg">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Project Leaderboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
                Ranked by community engagement and impact
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0"
              aria-hidden
            />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-secondary/80 border-border pl-10 h-11 sm:h-12 rounded-xl text-base sm:text-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
            <SelectTrigger className="w-full sm:w-52 bg-secondary/80 border-border h-11 sm:h-12 rounded-xl text-sm">
              <ArrowUpDown className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" aria-hidden />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="score">Highest Score</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table card */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-16 sm:w-20 text-center font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Rank
                  </TableHead>
                  <TableHead className="min-w-[240px] font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Project
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Category
                  </TableHead>
                  <TableHead className="hidden lg:table-cell font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Stage
                  </TableHead>
                  <TableHead className="text-right w-24 font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Stars
                  </TableHead>
                  <TableHead className="text-right w-20 hidden sm:table-cell font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Score
                  </TableHead>
                  <TableHead className="w-24 text-center hidden sm:table-cell font-display font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    Status
                  </TableHead>
                  <TableHead className="w-14 sm:w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranked.length > 0 ? (
                  ranked.map((project, index) => {
                    const rank = index + 1;
                    const isTopThree = rank <= 3;
                    return (
                      <TableRow
                        key={project.id}
                        className={cn(
                          "border-border transition-colors group",
                          isTopThree && "bg-primary/5 dark:bg-primary/10"
                        )}
                      >
                          <TableCell className="text-center py-4 align-middle">
                            {rank <= 3 ? (
                              <span
                                className={cn(
                                  "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg font-display font-bold text-sm",
                                  rank === 1 && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                                  rank === 2 && "bg-slate-400/20 text-slate-600 dark:text-slate-300",
                                  rank === 3 && "bg-amber-700/20 text-amber-700 dark:text-amber-600"
                                )}
                              >
                                <Medal className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                              </span>
                            ) : (
                              <span className="font-display font-semibold text-muted-foreground tabular-nums">
                                #{rank}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <Link
                              to={`/project/${project.id}`}
                              className="flex items-center gap-3 min-w-0 group/link"
                            >
                              <span
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg border border-border"
                                aria-hidden
                              >
                                {project.logo}
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate group-hover/link:text-primary transition-colors">
                                  {project.name}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">
                                  {project.tagline}
                                </p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-4 align-middle">
                            <Badge variant="secondary" className="font-normal text-xs">
                              {project.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-4 align-middle text-sm text-muted-foreground">
                            {project.stage}
                          </TableCell>
                          <TableCell className="py-4 text-right align-middle">
                            <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                              <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" aria-hidden />
                              {project.stars.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-4 text-right align-middle">
                            <span className="font-medium tabular-nums">{project.score}</span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell py-4 text-center align-middle">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {project.trending && (
                                <Badge
                                  variant="default"
                                  className="gap-1 text-xs bg-primary/90 hover:bg-primary/90"
                                >
                                  <TrendingUp className="h-3 w-3" aria-hidden />
                                  Trending
                                </Badge>
                              )}
                              {project.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                              {!project.trending && !project.verified && (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle">
                            <Link to={`/project/${project.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                aria-label={`View ${project.name}`}
                              >
                                <ChevronRight className="h-4 w-4" aria-hidden />
                              </Button>
                            </Link>
                          </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-border hover:bg-transparent">
                    <TableCell
                      colSpan={8}
                      className="py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Trophy className="h-12 w-12 opacity-50" aria-hidden />
                        <p className="font-display font-semibold">No projects match your search</p>
                        <p className="text-sm">Try a different search or sort</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
