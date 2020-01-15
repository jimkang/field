import { Project, ForceSource, ThingType, Thing } from './types';

// Singleton.

// Load from localStorage when the module is loaded.
var dictsForTypes: Record<string, Record<string, Thing>> = {
  project: {},
  forceSource: {}
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

if (window.localStorage.forceSources) {
  try {
    var forceSourceDict: Record<string, ForceSource> = JSON.parse(
      localStorage.forceSources
    );
    dictsForTypes['forceSource'] = forceSourceDict;
  } catch (e) {
    console.log(e, e.stack);
  }
}

function update(thingType: ThingType, thing: Project | ForceSource) {
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

function deleteThing(thingType: ThingType, thing: Project | ForceSource) {
  delete dictsForTypes[thingType][thing.id];
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
  deleteThing,
  clearAll,
  getAll
};
