
export interface Department {
  id: string;
  name: string;
  icon: string;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  year?: string;
  type: 'pdf' | 'text' | 'link';
  content?: string;
}

export interface UnitContent {
  unitNumber: number;
  title: string;
  concepts: string[];
  summary: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  year: number;
  semester: number;
  notes: Resource[];
  pastPapers: Resource[];
  importantQuestions: UnitContent[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  name: string;
  loggedInAt: number;
}

export interface SubjectCard {
  id: string;
  unit: number;
  title: string;
  description: string;
  icon: string;
  summary: string;
  diagramTitle: string;
  suggestedQuestions?: string[];
}
