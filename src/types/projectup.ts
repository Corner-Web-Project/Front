export interface Member {
  role: string;
  name: string;
}


export interface Projectup {
  generation: string;
  title: string;
  subtitle: string;
  description: string;

  logo: File | null;
  banner: File | null;
}


export interface Project {
  id: number;

  generation: string;
  title: string;
  subtitle: string;
  description: string;

  logo: string;
  banner: string;

  members: Member[];
}