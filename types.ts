export enum ThingType {
  project = 'project',
  attractor = 'attractor'
}

export interface NumberProp {
  name: string;
  value: number;
}

export interface Project {
  id: string;
  name: string;
  numberProps: Array<NumberProp>;
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
  numberProps: Array<NumberProp>;
  position: [number, number];
}

export type Thing = Project | Attractor;
