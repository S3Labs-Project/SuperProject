import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Project } from "@/types/project";
import type { PendingSubmission } from "@/types/project";
import { mockProjects } from "@/data/mockData";
import { mockPendingSubmissions } from "@/data/mockData";

type ProjectsContextValue = {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  pendingSubmissions: PendingSubmission[];
  setPendingSubmissions: React.Dispatch<React.SetStateAction<PendingSubmission[]>>;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  acceptSubmission: (pendingId: string) => void;
  rejectSubmission: (pendingId: string) => void;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function nextId(projects: Project[]): string {
  const nums = projects
    .map((p) => parseInt(p.id, 10))
    .filter((n) => !Number.isNaN(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => [...mockProjects]);
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>(
    () => [...mockPendingSubmissions],
  );

  const addProject = useCallback((project: Omit<Project, "id">) => {
    setProjects((prev) => {
      const id = nextId(prev);
      const newProject: Project = { ...project, id };
      return [...prev, newProject];
    });
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const acceptSubmission = useCallback((pendingId: string) => {
    setPendingSubmissions((prev) => {
      const pending = prev.find((s) => s.id === pendingId);
      if (!pending) return prev;
      const { submittedAt: _, ...rest } = pending;
      setProjects((projs) => {
        const id = nextId(projs);
        return [...projs, { ...rest, id }];
      });
      return prev.filter((s) => s.id !== pendingId);
    });
  }, []);

  const rejectSubmission = useCallback((pendingId: string) => {
    setPendingSubmissions((prev) => prev.filter((s) => s.id !== pendingId));
  }, []);

  const value: ProjectsContextValue = {
    projects,
    setProjects,
    pendingSubmissions,
    setPendingSubmissions,
    addProject,
    updateProject,
    removeProject,
    acceptSubmission,
    rejectSubmission,
  };

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
