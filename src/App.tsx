import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WalletProvider from "@/providers/WalletProvider";
import { ProjectsProvider } from "@/providers/ProjectsProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import ProjectDetail from "./pages/ProjectDetail";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import AdminProjectDetail from "./pages/AdminProjectDetail";
import AdminSubmissionDetail from "./pages/AdminSubmissionDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="superproject-theme" enableSystem={false}>
      <WalletProvider>
        <ProjectsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col">
              <Navbar />
            <main className="flex-1 min-w-0 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/project/:id" element={<AdminProjectDetail />} />
                <Route path="/admin/submission/:id" element={<AdminSubmissionDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
        </ProjectsProvider>
    </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
