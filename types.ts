export enum ThingType {
  project = 'project',
  attractor = 'attractor'
}

export interface Project {
  id: string;
  name: string;
  numberProps: Record<string, number>;
  strProps: Record<string, string>;
  created: Date;
  lastUpdated: Date;
  // Key: relationship name.
  // Value: List of project ids.
  relationships: Record<string, Array<string>>;
  position: [number, number];
}

export interface Attractor {
  id: string;
  name: string;
  numberProps: Record<string, number>;
  strProps: Record<string, string>;
  position: [number, number];
}

export type Thing = Project | Attractor;
