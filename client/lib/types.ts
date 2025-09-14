export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  type: string;
  name: string;
  description: string;
  skills: [Skill];
}

export interface Option {
  label: string;
  value: string;
}
