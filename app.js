var handleError = require('handle-error-web');
var RouteState = require('route-state');
var wireMainControls = require('./dom/wire-main-controls');
var d3 = require('d3-selection');
var projectsFlow = require('./flows/projects-flow');
var { roll } = require('probable');
var renderDownloadLink = require('render-dl-link');
var curry = require('lodash.curry');
var renderTopLevelToggles = require('./dom/render-top-level-toggles');
var intersection = require('lodash.intersection');
var accessor = require('accessor');
var oknok = require('oknok');
var initialFieldFlow = require('./flows/initial-field-flow');
var ep = require('errorback-promise');
var PouchDB = require('pouchdb');

import createNewField from './tasks/create-new-field';

var randomId = require('@jimkang/randomid')();

var routeState = RouteState({
  followRoute,
  windowObject: window,
  propsToCoerceToBool: ['hideUI', 'debug']
});

(function go() {
  window.onerror = reportTopLevelError;
  routeState.routeFromHash();
})();

// TODO: Consolidate selAttr and selProj into a single thing.
async function followRoute({
  hideUI,
  debug,
  field,
  selProj,
  selAttr,
  filterIncludeTags
}) {
  var includeTags;
  if (filterIncludeTags) {
    includeTags = filterIncludeTags.split(',');
  }

  var db = new PouchDB('fields-db');
  var { error, values } = await ep(initialFieldFlow, { fieldId: field, db });
  if (error) {
    handleError(error);
    return;
  }
  var { fieldStore, store } = values[0];
  routeState.addToRoute({ field: fieldStore.getFieldId() }, false);

  // var fieldNames = store.getFieldNames
  wireMainControls({
    onAddProjectClick,
    onClearProjectsClick: () =>
      fieldStore.clearAll(
        'project',
        oknok({ ok: refreshFromStore, nok: handleError })
      ),
    onAddForceSourceClick,
    onClearForceSourcesClick: () =>
      fieldStore.clearAll(
        'forceSource',
        oknok({ ok: refreshFromStore, nok: handleError })
      ),
    onExportClick,
    onImportFile,
    onFindAndReplace,
    onIncludeTags
  });

  d3.select(document.body).classed('hide-ui', hideUI);
  d3.select(document.body).classed('debug', debug);
  renderTopLevelToggles({ selProj, selAttr });

  refreshFromStore({ filterIncludeTags });

  function refreshFromStore() {
    var projects = fieldStore.getAll('project');
    var forceSources = fieldStore.getAll('forceSource');

    if (filterIncludeTags) {
      projects = projects.filter(curry(hasATag)(includeTags));
      forceSources = forceSources.filter(curry(hasATag)(includeTags));
    }

    projectsFlow({
      projectData: projects,
      forceSourceData: forceSources,
      selectedProjectId: selProj,
      selectedForceSourceId: selAttr,
      onSelectProject,
      onSelectForceSource,
      onInvalidate: routeState.routeFromHash
    });
  }

  function onAddProjectClick() {
    var now = new Date();
    var newProject = {
      id: `project-${randomId(4)}`,
      name: 'Cool Project',
      numberProps: [],
      created: now,
      lastUpdated: now,
      relationships: {},
      x: roll(100),
      y: roll(100),
      vx: 0,
      vy: 0
    };
    fieldStore.update(
      'project',
      newProject,
      oknok({
        ok: () => onSelectProject({ projectId: newProject.id }),
        nok: handleError
      })
    );
  }

  function onAddForceSourceClick() {
    var newForceSource = {
      id: `forceSource-${randomId(4)}`,
      name: 'Cool ForceSource',
      numberProps: [],
      x: 50,
      y: 50,
      fx: 50,
      fy: 50
    };
    fieldStore.update('forceSource', newForceSource);
    onSelectForceSource({ forceSourceId: newForceSource.id });
  }

  function onSelectProject({ projectId }) {
    if (!projectId) {
      routeState.removeFromRoute('selProj');
    } else {
      routeState.addToRoute({ selProj: projectId });
    }
  }

  function onSelectForceSource({ forceSourceId }) {
    if (!forceSourceId) {
      routeState.removeFromRoute('selAttr');
    } else {
      routeState.addToRoute({ selAttr: forceSourceId });
    }
  }

  function onExportClick() {
    var entiretyOfField = {
      projects: fieldStore.getAll('project'),
      forceSources: fieldStore.getAll('forceSource')
    };
    renderDownloadLink({
      blob: new Blob([JSON.stringify(entiretyOfField, null, 2)], {
        type: 'application/json'
      }),
      parentSelector: '#downloads',
      downloadLinkText: 'Download this field (JSON)',
      filename: 'personal-forces-field.json'
    });
    document.getElementById('downloads').classList.remove('hidden');
  }

  function onImportFile({ forceSources, projects }) {
    createNewField({ store, forceSources, projects });
    routeState.addToRoute({ field: fieldStore.getFieldId() });
  }

  function onFindAndReplace({ findText, replaceText }) {
    var projects = fieldStore.getAll('project');
    var forceSources = fieldStore.getAll('forceSource');
    projects.forEach(
      curry(findAndReplaceAttributeInThing)(findText, replaceText)
    );
    forceSources.forEach(
      curry(findAndReplaceAttributeInThing)(findText, replaceText)
    );
    fieldStore.updateAll('forceSource', forceSources);
    fieldStore.updateAll('project', projects);
    refreshFromStore();
  }

  function onIncludeTags(tags) {
    routeState.addToRoute({ filterIncludeTags: tags.join(',') });
  }
}

function findAndReplaceAttributeInThing(findText, replaceText, thing) {
  thing.numberProps.forEach(
    curry(findAndReplaceNumberPropName)(findText, replaceText)
  );
}

function findAndReplaceNumberPropName(findText, replaceText, numberProp) {
  if (numberProp.name === findText) {
    numberProp.name = replaceText;
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}

function hasATag(tagsToLookFor, thing) {
  return (
    intersection(tagsToLookFor, thing.tags.map(accessor('value'))).length > 0
  );
}
