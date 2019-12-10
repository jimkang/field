import { Project, Attractor, ThingType, Thing } from './types';

// Singleton.

// Load from localStorage when the module is loaded.
var dictsForTypes: Record<string, Record<string, Thing>> = {
  project: {},
  attractor: {}
};

if (window.localStorage.projects) {
  try {
    var projectDict: Record<string, Project> = JSON.parse(
      localStorage.projects
    );
    for (var id in projectDict) {
      inflateDates(projectDict[id]);
    }
    dictsForTypes['project'] = projectDict;
  } catch (e) {
    console.log(e, e.stack);
  }
}

if (window.localStorage.attractors) {
  try {
    var attractorDict: Record<string, Attractor> = JSON.parse(
      localStorage.attractors
    );
    dictsForTypes['attractor'] = attractorDict;
  } catch (e) {
    console.log(e, e.stack);
  }
}

function update(thingType: ThingType, thing: Project | Attractor) {
  dictsForTypes[thingType][thing.id] = thing;
  saveAll(thingType);
}

function saveAll(thingType: ThingType) {
  localStorage[`${thingType}s`] = JSON.stringify(dictsForTypes[thingType]);
}

function getAll(thingType: ThingType) {
  return Object.values(dictsForTypes[thingType]);
}

function clearAll(thingType: ThingType) {
  dictsForTypes[thingType] = {};
  saveAll(thingType);
}

function inflateDates(project: Project) {
  project.lastUpdated = inflateDateValue(project.lastUpdated);
  project.created = inflateDateValue(project.created);
}

function inflateDateValue(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
}

module.exports = {
  update,
  saveAll,
  clearAll,
  getAll
};
