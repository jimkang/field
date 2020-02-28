export enum ThingType {
  project = 'project',
  forceSource = 'forceSource'
}

export interface NumberProp {
  name: string;
  value: number;
}

export interface StringProp {
  id: string;
  value: string;
}

export interface Thing {
  lastUpdated: Date;
  id: string;
  name: string;
  numberProps: Array<NumberProp>;
  created: Date;
  // TODO: Shouldn't it just be an array of simple strings?
  tags: Array<StringProp>;
  thingType: ThingType;
  x: number;
  y: number;
}

export interface Project extends Thing {
  // Key: relationship name.
  // Value: List of project ids.
  relationships: Record<string, Array<string>>;
  // d3-force properties:
  index: number;
  vx: number;
  vy: number;
}

export interface ForceSource extends Thing {
  fx: number;
  fy: number;
}

export type ThingDict = Record<string, Thing>;

export type Done = (Error, any?) => void;
// TODO: Define FieldStore.
export interface StorePack {
  store?: object;
  fieldStore?: object;
  message?: object;
}

export type FieldStoreDone = (Error, StorePack?) => void;
