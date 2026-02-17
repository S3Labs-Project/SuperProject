import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Zap, Compass, Upload, Users, Rocket, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProjects } from "@/providers/ProjectsProvider";

const stats = [
  { label: "Total Projects", value: "420+", icon: Sparkles },
  { label: "Active Builders", value: "1,200+", icon: Zap },
  { label: "Hackathon Wins", value: "85+", icon: TrendingUp },
];

const howItWorks = [
  {
    step: "1",
    title: "Submit your project",
    description: "Add your Solana project built with or for Superteam. Share a link, description, and tags so others can find it.",
    icon: Upload,
  },
  {
    step: "2",
    title: "Get discovered",
    description: "Your project appears in Explore and can trend. Builders, investors, and the community browse and discover what’s being built.",
    icon: Compass,
  },
  {
    step: "3",
    title: "Grow with the community",
    description: "Connect with other builders, get feedback, and grow visibility within the Superteam and wider Solana ecosystem.",
    icon: Users,
  },
];

const faqs = [
  {
    question: "What is SuperProject?",
    answer: "SuperProject is the open directory and showcase for projects built by the Superteam ecosystem on Solana. Think of it as Product Hunt for Superteam—a place to discover, submit, and promote DeFi, NFTs, tools, and dApps from the community.",
  },
  {
    question: "Who can submit a project?",
    answer: "Anyone who has built (or is building) a project in the Superteam or Solana ecosystem can submit. Your project should have a link, description, and relevant tags so the community can find and understand it.",
  },
  {
    question: "What is Superteam?",
    answer: "Superteam is a global community of builders, creators, and operators focused on the Solana ecosystem. They run bounties, hackathons, and programs to grow the Solana ecosystem. Learn more at superteam.fun.",
  },
  {
    question: "Is it free to list my project?",
    answer: "Yes. Listing your project on SuperProject is free. We’re here to help the Superteam and Solana community discover and support each other’s work.",
  },
  {
    question: "How do projects get featured or trend?",
    answer: "Projects can appear in Trending and Recently Added based on community engagement and activity. Explore the site to see what’s popular and submit your project to get in front of builders and supporters.",
  },
];

const Index = () => {
  const { projects } = useProjects();
  const trendingProjects = projects.filter((p) => p.trending);
  const recentProjects = projects.slice(0, 6);

  return (
    <div className="min-h-screen grain-overlay">
      {/* Hero — purple gradient in dark, subtle in light */}
      <section className="relative z-0 overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 overflow-hidden">
          {/* Dark: deep purple gradient; Light: soft purple tint */}
          <div className="absolute inset-0 dark:hero-gradient opacity-100 bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent dark:from-transparent dark:via-transparent dark:to-transparent" />
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/4 translate-x-1/4 dark:bg-primary/20" />
          <div className="absolute bottom-0 left-0 h-[350px] w-[400px] rounded-full bg-primary/6 blur-[100px] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:opacity-50" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground backdrop-blur-sm animate-fade-in dark:bg-card/40">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">Product Hunt for Solana Superteam</span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl animate-fade-in animation-delay-100 dark:text-white">
              Discover what{" "}
              <span className="gradient-text">Superteam</span>{" "}
              is building
            </h1>

            <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-200 dark:text-white/80">
              <strong className="text-foreground dark:text-white">SuperProject</strong> is the open directory for projects built by{" "}
              <a href="https://superteam.fun" target="_blank" rel="noreferrer" className="text-primary hover:underline">Superteam</a>{" "}
              members on Solana. Explore what the community is building, submit your own project, get discovered, and grow with builders and supporters worldwide.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row animate-fade-in-up animation-delay-300">
              <Link to="/submit" className="w-full sm:w-auto">
                <Button size="lg" className="gradient-bg border-0 px-6 sm:px-8 font-semibold text-white hover:opacity-90 hover:scale-[1.02] h-11 sm:h-12 w-full sm:w-auto text-base transition-transform duration-200">
                  Submit Project
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </Link>
              <Link to="/explore" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="px-6 sm:px-8 h-11 sm:h-12 w-full sm:w-auto text-base border-border hover:bg-secondary hover:border-primary/30 transition-colors duration-200">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is SuperProject — for new users */}
      <section className="py-12 sm:py-16 md:py-20 relative z-0 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center rounded-xl border border-border bg-card/50 p-3 mb-6">
              <Rocket className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              What is SuperProject?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              SuperProject is the go-to showcase for everything built by the <span className="text-foreground dark:text-white font-medium">Superteam</span> ecosystem on Solana—from DeFi and NFTs to tools and dApps. Whether you’re a builder looking for visibility, an investor hunting for the next idea, or someone curious about Solana, you’ll find projects, builders, and traction in one place.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Don’t know Superteam?{" "}
              <a href="https://superteam.fun" target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                Learn more about Superteam →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 md:py-20 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              How it works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Submit, get discovered, and grow with the Superteam and Solana community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                className="section-reveal relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card/40 hover:bg-card/60 hover:border-primary/20 transition-colors duration-200"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg text-white font-display font-bold text-lg mb-4">
                  {item.step}
                </div>
                <item.icon className="h-6 w-6 text-primary mb-3" aria-hidden />
                <h3 className="font-display font-semibold text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — staggered reveal */}
      <section className="border-y border-border bg-card/40 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-glow flex flex-col items-center gap-2 py-4 text-center section-reveal"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
              >
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" aria-hidden />
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending — horizontal scroll with stagger */}
      <section className="py-12 sm:py-16 md:py-24 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Trending Projects</h2>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">Most popular this week</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:text-accent transition-colors shrink-0">
              View all →
            </Link>
          </div>
          <div className="overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="flex gap-4 sm:gap-5 w-max animate-marquee py-2">
              {[...trendingProjects, ...trendingProjects].map((project, i) => (
                <div
                  key={`${project.id}-${i}`}
                  className="w-[min(300px,85vw)] min-w-[260px] sm:w-[300px] shrink-0"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added — asymmetric grid */}
      <section className="pb-16 sm:pb-24 relative z-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Recently Added</h2>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">Fresh from the community</p>
            </div>
            <Link to="/explore" className="text-sm font-medium text-primary hover:text-accent transition-colors shrink-0">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project, i) => (
              <div
                key={project.id}
                className="section-reveal min-w-0"
                style={{ animationDelay: `${200 + i * 70}ms`, animationFillMode: "backwards" }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="py-12 sm:py-16 md:py-20 relative z-0 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <HelpCircle className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Frequently asked questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border px-4 rounded-lg bg-background/50">
                  <AccordionTrigger className="text-left hover:no-underline py-4 px-0">
                    <span className="font-medium text-foreground pr-2">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pt-0">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
