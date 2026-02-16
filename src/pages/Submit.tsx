import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, stages, chapters, hackathons } from "@/data/mockData";

const steps = ["Basics", "Details", "Links", "Review"];

const Submit = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", category: "", stage: "", chapter: "", hackathon: "",
    website: "", twitter: "", github: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 grain-overlay">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight">Submit Your Project</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10">Share what you're building with the Superteam community</p>

        {/* Progress */}
        <div className="mb-8 sm:mb-10 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 shrink-0 sm:shrink">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i < step ? "gradient-bg text-white scale-100" : i === step ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs sm:text-sm font-medium sm:block truncate ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 min-w-2 rounded-full transition-colors duration-300 hidden sm:block ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-4 sm:p-6 md:p-8 section-reveal">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Project Name *</label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. SolSwap" className="bg-secondary border-border" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tagline *</label>
                <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Short one-liner about your project" className="bg-secondary border-border" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Logo</label>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/80 hover:border-primary/50 hover:bg-secondary transition-all duration-200">
                  <div className="text-center">
                    <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">Click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Description *</label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell us about your project..." rows={5} className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Category *</label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Stage *</label>
                  <Select value={form.stage} onValueChange={(v) => update("stage", v)}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{stages.filter((s) => s !== "All").map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Chapter</label>
                  <Select value={form.chapter} onValueChange={(v) => update("chapter", v)}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{chapters.filter((c) => c !== "All").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Hackathon</label>
                  <Select value={form.hackathon} onValueChange={(v) => update("hackathon", v)}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{hackathons.filter((h) => h !== "All").map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Website URL</label>
                <Input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className="bg-secondary border-border" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Twitter / X</label>
                <Input value={form.twitter} onChange={(e) => update("twitter", e.target.value)} placeholder="https://twitter.com/..." className="bg-secondary border-border" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">GitHub</label>
                <Input value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." className="bg-secondary border-border" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-base sm:text-lg font-semibold">Review your submission</h3>
              <div className="space-y-3 text-sm sm:text-base">
                {Object.entries(form).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="border-border w-full sm:w-auto h-11 text-sm sm:text-base">
              <ArrowLeft className="mr-1.5 h-4 w-4 shrink-0" aria-hidden /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="gradient-bg border-0 text-white w-full sm:w-auto h-11 text-sm sm:text-base">
                Next <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
              </Button>
            ) : (
              <Button onClick={() => navigate("/")} className="gradient-bg border-0 text-white w-full sm:w-auto h-11 text-sm sm:text-base">
                Submit Project 🚀
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;
