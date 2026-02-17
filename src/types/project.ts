export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  category: string;
  stage: string;
  chapter: string;
  hackathon: string;
  stars: number;
  followers: number;
  users: number;
  verified: boolean;
  score: number;
  website: string;
  twitter: string;
  github: string;
  founders: { name: string; role: string; avatar: string }[];
  trending: boolean;
  createdAt: string;
}

/** Submission awaiting admin approval; same shape as Project with submittedAt */
export interface PendingSubmission extends Project {
  submittedAt: string;
}
