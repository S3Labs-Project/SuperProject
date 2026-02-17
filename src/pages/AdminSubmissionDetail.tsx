import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Users,
  Eye,
  Trophy,
  Github,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useProjects } from "@/providers/ProjectsProvider";
import type { PendingSubmission } from "@/types/project";

function formatSubmittedAt(iso: string) {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString(undefined, { dateStyle: "medium" }) +
      " at " +
      d.toLocaleTimeString(undefined, { timeStyle: "short" })
    );
  } catch {
    return iso;
  }
}

const AdminSubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pendingSubmissions, acceptSubmission, rejectSubmission } = useProjects();
  const submission = pendingSubmissions.find((s) => s.id === id);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleAccept = () => {
    if (submission) {
      acceptSubmission(submission.id);
      navigate("/admin", { state: { tab: "submissions" } });
    }
  };

  const handleReject = () => {
    if (submission) {
      rejectSubmission(submission.id);
      setShowRejectDialog(false);
      navigate("/admin", { state: { tab: "submissions" } });
    }
  };

  if (!submission) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 flex flex-col items-center justify-center text-center px-4">
        <p className="text-4xl sm:text-5xl mb-4" aria-hidden>
          😕
        </p>
        <p className="font-display font-semibold text-lg sm:text-xl">Submission not found</p>
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
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAccept}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden />
              Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="h-4 w-4 mr-1.5" aria-hidden />
              Reject
            </Button>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          <span>Pending submission — submitted {formatSubmittedAt(submission.submittedAt)}</span>
        </div>

        <div className="flex flex-col gap-6 lg:gap-10 lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 space-y-6 min-w-0">
            <div className="glass-card p-4 sm:p-6 md:p-8 section-reveal">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-secondary/80 text-2xl sm:text-3xl ring-1 ring-border/50">
                  {submission.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                      {submission.name}
                    </h1>
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-primary">
                      {submission.category}
                    </span>
                    <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 sm:px-3 py-0.5 text-xs font-medium text-accent">
                      {submission.stage}
                    </span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground">{submission.tagline}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {submission.website && (
                  <a href={submission.website} target="_blank" rel="noreferrer">
                    <Button
                      size="sm"
                      className="gradient-bg border-0 text-white hover:opacity-90 hover:scale-[1.02] transition-transform"
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Website
                    </Button>
                  </a>
                )}
                {submission.twitter && (
                  <a href={submission.twitter} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="hover:border-primary/40">
                      Twitter / X
                    </Button>
                  </a>
                )}
                {submission.github && (
                  <a href={submission.github} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="hover:border-primary/40">
                      <Github className="mr-1.5 h-3.5 w-3.5" /> GitHub
                    </Button>
                  </a>
                )}
                {!submission.website && !submission.twitter && !submission.github && (
                  <span className="text-sm text-muted-foreground">No links provided</span>
                )}
              </div>

              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">About</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {submission.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-base sm:text-lg font-semibold mb-2 sm:mb-3">Team</h2>
                {submission.founders?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {submission.founders.map((founder) => (
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
                ) : (
                  <p className="text-sm text-muted-foreground">No team info provided.</p>
                )}
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
                <p className="mt-3 font-display text-2xl sm:text-3xl font-bold">{submission.score}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Project Score</p>
              </div>
            </div>

            <div className="glass-card divide-y divide-border section-reveal animation-delay-200">
              {[
                { icon: Star, label: "Stars", value: submission.stars },
                { icon: Users, label: "Followers", value: submission.followers.toLocaleString() },
                { icon: Eye, label: "Users", value: submission.users.toLocaleString() },
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
                { label: "Chapter", value: submission.chapter || "—" },
                { label: "Hackathon", value: submission.hackathon || "—" },
                { label: "Submitted", value: formatSubmittedAt(submission.submittedAt) },
              ].map((d) => (
                <div key={d.label} className="flex justify-between text-sm gap-2">
                  <span className="text-muted-foreground shrink-0">{d.label}</span>
                  <span className="font-medium text-right truncate">{d.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this submission?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{submission.name}&quot; will be removed from the pending queue. You can ask the
              submitter to resubmit later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSubmissionDetail;
