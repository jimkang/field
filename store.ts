import {
  Project,
  ForceSource,
  ThingType,
  Thing,
  ThingDict,
  Done
} from './types';
var PouchDB = require('pouchdb');
var oknok = require('oknok');

var randomId = require('@jimkang/randomid')();

var {
  thingDefaults,
  projectDefaults,
  forceSourceDefaults
} = require('./defaults');
var curry = require('lodash.curry');

function Store() {
  var db = new PouchDB('fields-db');

  return { loadField, getFieldNames, createField };

  function loadField({ field }: { field: string }, done: Done) {
    db.get(field, oknok({ ok: doc => done(null, FieldStore(doc)), nok: done }));
  }

  function getFieldNames(done: Done) {
    db.allDocs(
      { include_docs: true },
      oknok({ ok: getJustNamesAndIds, nok: done })
    );
  }

  function createField(
    {
      name,
      projects,
      forceSources
    }: { name: string; projects: ThingDict; forceSources: ThingDict },
    done: Done
  ) {
    var field = {
      _id: new Date().toJSON(),
      name,
      id: `field-${randomId(4)}`,
      projects: projects || {},
      forceSources: forceSources || {}
    };
    db.put(field, oknok({ ok: () => done(null, field), nok: done }));
  }

  function getJustNamesAndIds(result, done) {
    done(null, result.rows.map(getNameAndId));
  }

  function getNameAndId({ id, name }) {
    return { id, name };
  }

  function FieldStore(doc) {
    const _id: string = doc._id;

    var dictsForTypes: Record<string, ThingDict> = {
      project: {},
      forceSource: {}
    };

    if (doc.projects) {
      var projectDict: Record<string, Project> = doc.projects;
      for (var id in projectDict) {
        inflateDates(projectDict[id]);
      }
      dictsForTypes['project'] = projectDict;
    }

    if (doc.forceSources) {
      var forceSourceDict: Record<string, ForceSource> = doc.forceSources;
      dictsForTypes['forceSource'] = forceSourceDict;
    }

    return {
      update,
      updateAll,
      saveAll,
      deleteThing,
      clearAll,
      getAll
    };

    function update(
      thingType: ThingType,
      thing: Project | ForceSource,
      done: Done
    ) {
      dictsForTypes[thingType][thing.id] = thing;
      saveAll(done);
    }

    function updateAll(
      thingType: ThingType,
      things: Array<Project | ForceSource>,
      done: Done
    ) {
      things.forEach(curry(update)(thingType));
      saveAll(done);
    }

    function saveAll(done: Done) {
      var field = {
        _id,
        projects: dictsForTypes['project'],
        forceSource: dictsForTypes['forceSource']
      };

      db.put(field, done);
    }

    function getAll(thingType: ThingType) {
      //return Object.values(dictsForTypes[thingType]);
      return Object.values(dictsForTypes[thingType]).map(
        curry(upgradeThing)(thingType)
      );
    }

    function clearAll(thingType: ThingType, done: Done) {
      dictsForTypes[thingType] = {};
      saveAll(done);
    }

    function deleteThing(
      thingType: ThingType,
      thing: Project | ForceSource,
      done: Done
    ) {
      delete dictsForTypes[thingType][thing.id];
      saveAll(done);
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
  }
}

module.exports = Store;
