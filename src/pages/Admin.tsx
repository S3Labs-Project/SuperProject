import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  ExternalLink,
  Users,
  Inbox,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Star,
  TrendingUp,
  BadgeCheck,
  BarChart3,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/providers/ProjectsProvider";
import { categories, stages, chapters, hackathons } from "@/data/mockData";
import { Project } from "@/types/project";
import type { PendingSubmission } from "@/types/project";
import type { MemberWithProjects } from "@/pages/Members";
import { deriveMembersFromProjects } from "@/pages/Members";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { format, parseISO } from "date-fns";

function formatSubmittedAt(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: "medium" }) + " " + d.toLocaleTimeString(undefined, { timeStyle: "short" });
  } catch {
    return iso;
  }
}

const Admin = () => {
  const {
    projects,
    pendingSubmissions,
    acceptSubmission,
    rejectSubmission,
    updateProject,
    removeProject,
  } = useProjects();

  const [search, setSearch] = useState("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [memberSearch, setMemberSearch] = useState("");
  const [editMember, setEditMember] = useState<MemberWithProjects | null>(null);
  const [editMemberForm, setEditMemberForm] = useState({ name: "", role: "", avatar: "" });

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return [...projects];
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.chapter.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const allMembers = useMemo(() => deriveMembersFromProjects(projects), [projects]);
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return allMembers;
    const q = memberSearch.toLowerCase();
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.projectNames.some((pn) => pn.toLowerCase().includes(q)),
    );
  }, [allMembers, memberSearch]);

  const overviewStats = useMemo(() => {
    const byCategory = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    const byStage = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.stage] = (acc[p.stage] ?? 0) + 1;
      return acc;
    }, {});
    const byChapter = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.chapter] = (acc[p.chapter] ?? 0) + 1;
      return acc;
    }, {});
    const byHackathon = projects.reduce<Record<string, number>>((acc, p) => {
      acc[p.hackathon] = (acc[p.hackathon] ?? 0) + 1;
      return acc;
    }, {});
    const recentProjects = [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
    return {
      totalProjects: projects.length,
      totalMembers: allMembers.length,
      pending: pendingSubmissions.length,
      verified: projects.filter((p) => p.verified).length,
      trending: projects.filter((p) => p.trending).length,
      totalStars: projects.reduce((s, p) => s + p.stars, 0),
      totalUsers: projects.reduce((s, p) => s + p.users, 0),
      totalFollowers: projects.reduce((s, p) => s + p.followers, 0),
      byCategory,
      byStage,
      byChapter,
      byHackathon,
      recentProjects,
    };
  }, [projects, allMembers.length, pendingSubmissions.length]);

  const chartData = useMemo(() => {
    const categoryList = categories.filter((c) => c !== "All");
    const categoryChart = categoryList
      .map((name) => ({ name, count: overviewStats.byCategory[name] ?? 0 }))
      .filter((d) => d.count > 0);

    const stageList = ["Idea", "MVP", "Mainnet"];
    const stageChart = stageList
      .map((name) => ({ name, value: overviewStats.byStage[name] ?? 0 }))
      .filter((d) => d.value > 0);

    const byMonth: Record<string, number> = {};
    projects.forEach((p) => {
      try {
        const month = p.createdAt.slice(0, 7);
        byMonth[month] = (byMonth[month] ?? 0) + 1;
      } catch {
        // skip
      }
    });
    const months = Object.keys(byMonth).sort();
    const monthlyChart = months.map((month) => {
      try {
        const label = format(parseISO(month + "-01"), "MMM yyyy");
        return { month: label, projects: byMonth[month] ?? 0 };
      } catch {
        return { month, projects: byMonth[month] ?? 0 };
      }
    });

    const chapterChart = Object.entries(overviewStats.byChapter)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));

    const hackathonChart = hackathons
      .filter((h) => h !== "All")
      .map((name) => ({ name, count: overviewStats.byHackathon[name] ?? 0 }))
      .filter((d) => d.count > 0);

    const topStarsChart = [...projects]
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 8)
      .map((p) => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name, stars: p.stars }));

    return { categoryChart, stageChart, monthlyChart, chapterChart, hackathonChart, topStarsChart };
  }, [projects, overviewStats]);

  const categoryChartConfig: ChartConfig = useMemo(() => {
    const c: ChartConfig = { count: { label: "Projects" } };
    categories.filter((x) => x !== "All").forEach((cat) => {
      c[cat] = { label: cat };
    });
    return c;
  }, []);

  const stageChartConfig: ChartConfig = useMemo(
    () => ({
      value: { label: "Projects" },
      Idea: { label: "Idea" },
      MVP: { label: "MVP" },
      Mainnet: { label: "Mainnet" },
    }),
    [],
  );

  const monthlyChartConfig: ChartConfig = useMemo(() => ({ projects: { label: "Projects added" } }), []);

  const CHART_COLORS = [
    "hsl(var(--primary))",
    "hsl(262 72% 50%)",
    "hsl(200 90% 50%)",
    "hsl(150 70% 42%)",
    "hsl(30 90% 55%)",
    "hsl(330 80% 55%)",
    "hsl(280 60% 50%)",
    "hsl(180 70% 45%)",
  ];

  const openEdit = (project: Project) => {
    setEditProject(project);
    setEditForm({ ...project });
  };

  const closeEdit = () => {
    setEditProject(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editProject) return;
    updateProject(editProject.id, editForm);
    closeEdit();
  };

  const confirmDelete = () => {
    if (deleteProject) {
      removeProject(deleteProject.id);
      setDeleteProject(null);
    }
  };

  const openEditMember = (member: MemberWithProjects) => {
    setEditMember(member);
    setEditMemberForm({ name: member.name, role: member.role, avatar: member.avatar });
  };

  const closeEditMember = () => {
    setEditMember(null);
    setEditMemberForm({ name: "", role: "", avatar: "" });
  };

  const saveEditMember = () => {
    if (!editMember) return;
    const { name, role, avatar } = editMemberForm;
    const originalName = editMember.name;
    projects.forEach((project) => {
      const hasFounder = project.founders.some((f) => f.name === originalName);
      if (!hasFounder) return;
      const updatedFounders = project.founders.map((f) =>
        f.name === originalName ? { name, role, avatar } : f,
      );
      updateProject(project.id, { founders: updatedFounders });
    });
    closeEditMember();
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage projects and members
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card/80 border border-border p-1 rounded-xl inline-flex h-12 flex-wrap gap-1">
            <TabsTrigger value="overview" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2" title="Overview">
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2" title="Projects">
              <FolderOpen className="h-4 w-4 shrink-0" aria-hidden />
              <span>Projects</span>
              {pendingSubmissions.length > 0 && (
                <Badge variant="secondary" className="text-xs shrink-0 ml-0.5">
                  {pendingSubmissions.length} pending
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members" className="rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2" title="Members">
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              <span>Members</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            <p className="text-sm text-muted-foreground">
              Complete summary of projects, members, and activity.
            </p>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Projects</p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.totalProjects}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.totalMembers}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.pending}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified
                  </p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.verified}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden /> Trending
                  </p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.trending}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" aria-hidden /> Stars
                  </p>
                  <p className="text-xl font-display font-bold mt-0.5">{overviewStats.totalStars.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Total users (all projects)</p>
                  <p className="text-2xl font-display font-bold mt-0.5">{overviewStats.totalUsers.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Total followers (all projects)</p>
                  <p className="text-2xl font-display font-bold mt-0.5">{overviewStats.totalFollowers.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card/60 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Projects by category
                  </CardTitle>
                  <CardDescription>Number of projects per category</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.categoryChart.length > 0 ? (
                    <ChartContainer config={categoryChartConfig} className="h-[280px] w-full">
                      <BarChart data={chartData.categoryChart} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                      No category data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/60 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers className="h-4 w-4 text-primary" />
                    Projects by stage
                  </CardTitle>
                  <CardDescription>Distribution: Idea, MVP, Mainnet</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.stageChart.length > 0 ? (
                    <ChartContainer config={stageChartConfig} className="h-[280px] w-full">
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={chartData.stageChart}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.stageChart.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                      No stage data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {chartData.monthlyChart.length > 0 && (
              <Card className="border-border bg-card/60 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Projects added over time
                  </CardTitle>
                  <CardDescription>New projects by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={monthlyChartConfig} className="h-[240px] w-full">
                    <BarChart data={chartData.monthlyChart} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                      <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                      <Bar dataKey="projects" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartData.chapterChart.length > 0 && (
                <Card className="border-border bg-card/60 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Projects by chapter
                    </CardTitle>
                    <CardDescription>Region distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{ count: { label: "Projects" } }} className="h-[260px] w-full">
                      <BarChart data={chartData.chapterChart} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                        <Bar dataKey="count" fill="hsl(262 72% 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
              {chartData.hackathonChart.length > 0 && (
                <Card className="border-border bg-card/60 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Projects by hackathon
                    </CardTitle>
                    <CardDescription>Hackathon attribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{ count: { label: "Projects" } }} className="h-[260px] w-full">
                      <BarChart data={chartData.hackathonChart} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                        <Bar dataKey="count" fill="hsl(200 90% 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {chartData.topStarsChart.length > 0 && (
              <Card className="border-border bg-card/60 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Star className="h-4 w-4 text-primary" />
                    Top projects by stars
                  </CardTitle>
                  <CardDescription>Most starred projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ stars: { label: "Stars" } }} className="h-[260px] w-full">
                    <BarChart data={chartData.topStarsChart} layout="vertical" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                      <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                      <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                      <Bar dataKey="stars" fill="hsl(30 90% 55%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* By category */}
            <Card className="border-border bg-card/60">
              <CardHeader>
                <CardTitle className="text-base">By category</CardTitle>
                <CardDescription>Project count per category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs font-medium">
                      {cat}: {overviewStats.byCategory[cat] ?? 0}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By stage & chapter & hackathon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">By stage</CardTitle>
                  <CardDescription>Idea, MVP, Mainnet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Idea", "MVP", "Mainnet"].map((stage) => (
                      <Badge key={stage} variant="outline" className="text-xs font-medium">
                        {stage}: {overviewStats.byStage[stage] ?? 0}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">By chapter</CardTitle>
                  <CardDescription>Region distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(overviewStats.byChapter)
                      .sort(([, a], [, b]) => b - a)
                      .map(([ch, count]) => (
                        <Badge key={ch} variant="outline" className="text-xs font-medium">
                          {ch}: {count}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base">By hackathon</CardTitle>
                  <CardDescription>Hackathon attribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hackathons.filter((h) => h !== "All").map((h) => (
                      <Badge key={h} variant="outline" className="text-xs font-medium">
                        {h}: {overviewStats.byHackathon[h] ?? 0}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent projects */}
            <Card className="border-border bg-card/60">
              <CardHeader>
                <CardTitle className="text-base">Recent projects</CardTitle>
                <CardDescription>Latest added projects</CardDescription>
              </CardHeader>
              <CardContent>
                {overviewStats.recentProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {overviewStats.recentProjects.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0" aria-hidden>{p.logo}</span>
                          <span className="font-medium truncate">{p.name}</span>
                          <Badge variant="secondary" className="text-xs shrink-0">{p.category}</Badge>
                        </div>
                        <Link
                          to={`/admin/project/${p.id}`}
                          className="text-primary hover:underline text-sm shrink-0 flex items-center gap-1"
                        >
                          View
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects tab */}
          <TabsContent value="projects" className="mt-0 space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Projects</p>
                  <p className="text-2xl font-display font-bold mt-0.5">{projects.length}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-display font-bold mt-0.5">{allMembers.length}</p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/60">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-display font-bold mt-0.5">{pendingSubmissions.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending submissions */}
            {pendingSubmissions.length > 0 && (
              <Card className="border-border bg-card/60">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Inbox className="h-4 w-4 text-primary" aria-hidden />
                    Pending submissions
                  </CardTitle>
                  <CardDescription>Accept to add a project, or reject to remove from queue.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingSubmissions.map((sub: PendingSubmission) => (
                      <SubmissionRow
                        key={sub.id}
                        submission={sub}
                        onAccept={() => acceptSubmission(sub.id)}
                        onReject={() => rejectSubmission(sub.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All projects */}
            <Card className="border-border bg-card/60">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">All projects</CardTitle>
                    <CardDescription>View, edit, or delete. Search by name, category, or chapter.</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 bg-secondary/80 border-border h-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 pt-0">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-semibold">Project</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Stage</TableHead>
                        <TableHead className="font-semibold text-right">Score</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold w-[180px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                            No projects found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProjects.map((project) => (
                          <TableRow key={project.id} className="border-border">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg" aria-hidden>{project.logo}</span>
                                <div>
                                  <div className="font-medium">{project.name}</div>
                                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{project.tagline}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{project.stage}</TableCell>
                            <TableCell className="text-right font-medium">{project.score}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {project.verified && <Badge variant="default" className="text-xs">Verified</Badge>}
                                {project.trending && <Badge variant="outline" className="text-xs">Trending</Badge>}
                                {!project.verified && !project.trending && <span className="text-xs text-muted-foreground">—</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Link
                                  to={`/admin/project/${project.id}`}
                                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                                >
                                  View
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                                </Link>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-sm" onClick={() => openEdit(project)}>
                                  <Pencil className="h-3.5 w-3.5 mr-1" aria-hidden />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-sm text-destructive hover:bg-destructive/10" onClick={() => setDeleteProject(project)}>
                                  <Trash2 className="h-3.5 w-3.5 mr-1" aria-hidden />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members tab */}
          <TabsContent value="members" className="mt-0">
            <Card className="border-border bg-card/60">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">Members</CardTitle>
                    <CardDescription>People building on your projects. Edit name, role, or avatar.</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
                    <Input
                      placeholder="Search..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-9 bg-secondary/80 border-border h-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6 pt-0">
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="font-semibold">Member</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Projects</TableHead>
                        <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No members found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMembers.map((member) => (
                          <TableRow key={member.name} className="border-border">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-bg text-xs font-bold text-white">
                                  {member.avatar}
                                </span>
                                <span className="font-medium">{member.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{member.role}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {member.projectNames.map((pn, i) => (
                                  <Link
                                    key={member.projectIds[i]}
                                    to={`/admin/project/${member.projectIds[i]}`}
                                    className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs bg-secondary/80 hover:bg-secondary border border-border"
                                  >
                                    {pn}
                                  </Link>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-sm" onClick={() => openEditMember(member)}>
                                <Pencil className="h-3.5 w-3.5 mr-1" aria-hidden />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editProject} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>Change name, links, category, and more.</DialogDescription>
          </DialogHeader>
          {editProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={editForm.name ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Tagline</Label>
                <Input
                  value={editForm.tagline ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, tagline: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Logo (emoji)</Label>
                <Input
                  value={editForm.logo ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, logo: e.target.value }))}
                  placeholder="🔄"
                  className="bg-secondary border-border w-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={editForm.category ?? ""}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, category: v }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Stage</Label>
                  <Select
                    value={editForm.stage ?? ""}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, stage: v }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.filter((s) => s !== "All").map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Chapter</Label>
                  <Select
                    value={editForm.chapter ?? ""}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, chapter: v }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Hackathon</Label>
                  <Select
                    value={editForm.hackathon ?? ""}
                    onValueChange={(v) => setEditForm((f) => ({ ...f, hackathon: v }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathons.filter((h) => h !== "All").map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Score</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.score ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, score: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Stars</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.stars ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, stars: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Users</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.users ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, users: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Followers</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.followers ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, followers: parseInt(e.target.value, 10) || 0 }))}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Website</Label>
                <Input
                  value={editForm.website ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Twitter</Label>
                <Input
                  value={editForm.twitter ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, twitter: e.target.value }))}
                  placeholder="https://twitter.com/..."
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>GitHub</Label>
                <Input
                  value={editForm.github ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, github: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="bg-secondary border-border"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label>Verified</Label>
                  <p className="text-xs text-muted-foreground">Show verified badge</p>
                </div>
                <Switch
                  checked={editForm.verified ?? false}
                  onCheckedChange={(v) => setEditForm((f) => ({ ...f, verified: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label>Trending</Label>
                  <p className="text-xs text-muted-foreground">Show in trending section</p>
                </div>
                <Switch
                  checked={editForm.trending ?? false}
                  onCheckedChange={(v) => setEditForm((f) => ({ ...f, trending: v }))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>Cancel</Button>
            <Button onClick={saveEdit} className="gradient-bg border-0 text-white">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteProject} onOpenChange={(open) => !open && setDeleteProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteProject?.name}&quot; from the directory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit member dialog */}
      <Dialog open={!!editMember} onOpenChange={(open) => !open && closeEditMember()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
            <DialogDescription>Name, role, and avatar. Saves to all their projects.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={editMemberForm.name}
                onChange={(e) => setEditMemberForm((f) => ({ ...f, name: e.target.value }))}
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Input
                value={editMemberForm.role}
                onChange={(e) => setEditMemberForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Founder, Co-founder"
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid gap-2">
              <Label>Avatar (initials)</Label>
              <Input
                value={editMemberForm.avatar}
                onChange={(e) => setEditMemberForm((f) => ({ ...f, avatar: e.target.value }))}
                placeholder="e.g. JD"
                className="bg-secondary border-border w-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditMember}>Cancel</Button>
            <Button onClick={saveEditMember} className="gradient-bg border-0 text-white">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function SubmissionRow({
  submission,
  onAccept,
  onReject,
}: {
  submission: PendingSubmission;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5" aria-hidden>{submission.logo}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground break-words">{submission.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 sm:truncate mt-0.5">{submission.tagline}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Submitted {formatSubmittedAt(submission.submittedAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant="secondary" className="text-xs">{submission.category}</Badge>
          <Badge variant="outline" className="text-xs">{submission.stage}</Badge>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-border/60 sm:border-t-0 sm:pt-0 sm:shrink-0">
        <Link
          to={`/admin/submission/${submission.id}`}
          className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-primary hover:underline text-sm min-h-[44px] sm:min-h-0 py-2 rounded-lg hover:bg-primary/5 transition-colors"
        >
          View
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white min-h-[44px] sm:min-h-0"
            onClick={onAccept}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
            Accept
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0"
            onClick={onReject}
          >
            <XCircle className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
