var handleError = require('handle-error-web');
var RouteState = require('route-state');
var wireControls = require('./dom/wire-controls');
var d3 = require('d3-selection');
import { getProjects, updateProject, clearProjects } from './store';
var projectsFlow = require('./flows/projects-flow');

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

function followRoute({ hideUI, debug, selProj }) {
  wireControls({
    onAddProjectClick,
    onClearClick: clearProjects
  });

  d3.select(document.body).classed('hide-ui', hideUI);
  d3.select(document.body).classed('debug', debug);

  var projects = getProjects();
  if (!selProj) {
    // TODO: Pick latest?
    routeState.addToRoute({ selProj: projects[0].id });
    return;
  }

  projectsFlow({ projectData: projects, selectedProjectId: selProj });

  function onAddProjectClick() {
    var now = new Date();
    updateProject({
      id: `project-${randomId(4)}`,
      name: 'Cool Project',
      numberProps: {},
      strProps: {},
      created: now,
      lastUpdated: now,
      relationships: {}
    });
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
