var handleError = require('handle-error-web');
var RouteState = require('route-state');
var wireMainControls = require('./dom/wire-main-controls');
var d3 = require('d3-selection');
import { getAll, clearAll, update, updateAll } from './store';
var projectsFlow = require('./flows/projects-flow');
var { roll } = require('probable');
var renderDownloadLink = require('render-dl-link');
var curry = require('lodash.curry');
var renderTopLevelToggles = require('./dom/render-top-level-toggles');
var intersection = require('lodash.intersection');
var accessor = require('accessor');

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
function followRoute({ hideUI, debug, selProj, selAttr, filterIncludeTags }) {
  var includeTags;
  if (filterIncludeTags) {
    includeTags = filterIncludeTags.split(',');
  }

  wireMainControls({
    onAddProjectClick,
    onClearProjectsClick: createRunner([
      () => clearAll('project'),
      refreshFromStore
    ]),
    onAddForceSourceClick,
    onClearForceSourcesClick: createRunner([
      () => clearAll('forceSource'),
      refreshFromStore
    ]),
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
    var projects = getAll('project');
    var forceSources = getAll('forceSource');

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
    update('project', newProject);
    onSelectProject({ projectId: newProject.id });
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
    update('forceSource', newForceSource);
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
      projects: getAll('project'),
      forceSources: getAll('forceSource')
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
    clearAll('forceSource');
    clearAll('project');
    updateAll('forceSource', forceSources);
    updateAll('project', projects);
    refreshFromStore();
  }

  function onFindAndReplace({ findText, replaceText }) {
    var projects = getAll('project');
    var forceSources = getAll('forceSource');
    projects.forEach(
      curry(findAndReplaceAttributeInThing)(findText, replaceText)
    );
    forceSources.forEach(
      curry(findAndReplaceAttributeInThing)(findText, replaceText)
    );
    updateAll('forceSource', forceSources);
    updateAll('project', projects);
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

function createRunner(fns) {
  return run;

  function run() {
    fns.forEach(runFn);
  }
}

function hasATag(tagsToLookFor, thing) {
  return (
    intersection(tagsToLookFor, thing.tags.map(accessor('value'))).length > 0
  );
}

function runFn(fn) {
  fn();
}
