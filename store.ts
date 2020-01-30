import { Project, ForceSource, ThingType, Thing } from './types';
var {
  thingDefaults,
  projectDefaults,
  forceSourceDefaults
} = require('./defaults');
var curry = require('lodash.curry');

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

function updateAll(thingType: ThingType, things: Array<Project | ForceSource>) {
  things.forEach(curry(update)(thingType));
  saveAll(thingType);
}

function saveAll(thingType: ThingType) {
  localStorage[`${thingType}s`] = JSON.stringify(dictsForTypes[thingType]);
}

function getAll(thingType: ThingType) {
  //return Object.values(dictsForTypes[thingType]);
  return Object.values(dictsForTypes[thingType]).map(
    curry(upgradeThing)(thingType)
  );
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

function upgradeThing(thingType: ThingType, thing: Thing): Thing {
  fillInBlanks(thing, thingDefaults);
  if (thingType === 'forceSource') {
    fillInBlanks(thing, forceSourceDefaults);
  } else if (thingType === 'project') {
    fillInBlanks(thing, projectDefaults);
  }
  return thing;
}

function fillInBlanks(target, source) {
  for (var key in source) {
    if (!(key in target)) {
      let value = source[key];
      if (Array.isArray(value)) {
        // Avoid setting this to a reference to the array on the template.
        target[key] = value.slice();
      } else if (value instanceof Date) {
        target[key] = new Date(value);
      } else if (typeof value === 'object') {
        // TODO.
        throw new Error('Copying objects not implemented.');
      } else {
        target[key] = value;
      }
    }
  }
}

module.exports = {
  update,
  updateAll,
  saveAll,
  deleteThing,
  clearAll,
  getAll
};
