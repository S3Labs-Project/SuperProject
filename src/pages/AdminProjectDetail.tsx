import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Users,
  Eye,
  BadgeCheck,
  Trophy,
  Github,
  Pencil,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const AdminProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, removeProject } = useProjects();
  const project = projects.find((p) => p.id === id);
  const similar = projects.filter((p) => p.id !== id && p.category === project?.category).slice(0, 3);

  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const openEdit = () => {
    if (project) {
      setEditForm({ ...project });
      setShowEditDialog(true);
    }
  };

  const saveEdit = () => {
    if (!project) return;
    updateProject(project.id, editForm);
    setShowEditDialog(false);
  };

  const confirmDelete = () => {
    if (project) {
      removeProject(project.id);
      setShowDeleteDialog(false);
      navigate("/admin");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl sm:text-5xl mb-4" aria-hidden>😕</p>
        <p className="font-display font-semibold text-lg sm:text-xl">Project not found</p>
        <Link to="/admin" className="text-primary text-sm sm:text-base mt-2 inline-block">
          ← Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground group py-1"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 shrink-0" aria-hidden />
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            Back to Admin
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openEdit} className="border-border">
              <Pencil className="h-4 w-4 mr-1.5" aria-hidden />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1.5" aria-hidden />
              Delete
            </Button>
          </div>
        </div>

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
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                      {project.name}
                    </h1>
                    {project.verified && (
                      <BadgeCheck className="h-5 w-5 text-primary shrink-0" aria-hidden />
                    )}
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-primary">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-accent">
                      {project.stage}
                    </span>
                    {project.trending && (
                      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                        Trending
                      </span>
                    )}
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
                    <Button size="sm" variant="outline" className="hover:border-primary/40">
                      Twitter / X
                    </Button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="hover:border-primary/40">
                      <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                    </Button>
                  </a>
                )}
              </div>

              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">About</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">Team</h2>
                <div className="flex flex-wrap gap-3">
                  {project.founders.map((founder) => (
                    <div
                      key={founder.name}
                      className="flex items-center gap-3 rounded-xl bg-secondary/80 p-3 border border-border/50 hover:border-primary/20 transition-colors min-w-0"
                    >
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
              <h3 className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Details
              </h3>
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

      {/* Edit dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>Update project details. Changes apply immediately.</DialogDescription>
          </DialogHeader>
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
                <Label>Score</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editForm.score ?? 0}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, score: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Stars</Label>
                <Input
                  type="number"
                  min={0}
                  value={editForm.stars ?? 0}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, stars: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Users</Label>
                <Input
                  type="number"
                  min={0}
                  value={editForm.users ?? 0}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, users: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label>Followers</Label>
                <Input
                  type="number"
                  min={0}
                  value={editForm.followers ?? 0}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, followers: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} className="gradient-bg border-0 text-white">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{project.name}&quot; from the directory. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjectDetail;
