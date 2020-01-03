var handleError = require('handle-error-web');
var RouteState = require('route-state');
var wireMainControls = require('./dom/wire-main-controls');
var d3 = require('d3-selection');
import { getAll, clearAll, update } from './store';
var projectsFlow = require('./flows/projects-flow');
var { roll } = require('probable');

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

function followRoute({ hideUI, debug, selProj, selAttr }) {
  wireMainControls({
    onAddProjectClick,
    onClearProjectsClick: createRunner([
      () => clearAll('project'),
      refreshFromStore
    ]),
    onAddAttractorClick,
    onClearAttractorsClick: createRunner([
      () => clearAll('attractor'),
      refreshFromStore
    ])
  });

  d3.select(document.body).classed('hide-ui', hideUI);
  d3.select(document.body).classed('debug', debug);

  refreshFromStore();

  function refreshFromStore() {
    var projects = getAll('project');
    var attractors = getAll('attractor');

    projectsFlow({
      projectData: projects,
      attractorData: attractors,
      selectedProjectId: selProj,
      selectedAttractorId: selAttr,
      onSelectProject,
      onSelectAttractor,
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

  function onAddAttractorClick() {
    var newAttractor = {
      id: `attractor-${randomId(4)}`,
      name: 'Cool Attractor',
      numberProps: [],
      x: 50,
      y: 50
    };
    update('attractor', newAttractor);
    onSelectAttractor({ attractorId: newAttractor.id });
  }

  function onSelectProject({ projectId }) {
    routeState.addToRoute({ selProj: projectId });
  }

  function onSelectAttractor({ attractorId }) {
    routeState.addToRoute({ selAttr: attractorId });
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

function runFn(fn) {
  fn();
}
