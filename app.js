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

  refreshProjects();

  function refreshProjects() {
    var projects = getProjects();
    if (!selProj) {
      // TODO: Pick latest?
      routeState.addToRoute({ selProj: projects[0].id });
      return;
    }

    projectsFlow({
      projectData: projects,
      selectedProjectId: selProj,
      onSelectProject,
      onInvalidateProjects: refreshProjects
    });
  }

  function onAddProjectClick() {
    var now = new Date();
    var newProject = {
      id: `project-${randomId(4)}`,
      name: 'Cool Project',
      numberProps: {},
      strProps: {},
      created: now,
      lastUpdated: now,
      relationships: {}
    };
    updateProject(newProject);
    onSelectProject({ projectId: newProject.id });
  }

  function onSelectProject({ projectId }) {
    routeState.addToRoute({ selProj: projectId });
  }
}

function reportTopLevelError(msg, url, lineNo, columnNo, error) {
  handleError(error);
}
