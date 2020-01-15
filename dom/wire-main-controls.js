var OLPE = require('one-listener-per-element');
var { on } = OLPE();

function wireMainControls({
  onAddProjectClick,
  onClearProjectsClick,
  onAddForceSourceClick,
  onClearForceSourcesClick
}) {
  on('#add-project-button', 'click', onAddProjectClick);
  on('#clear-projects-button', 'click', onClearProjectsClick);
  on('#add-forceSource-button', 'click', onAddForceSourceClick);
  on('#clear-forceSources-button', 'click', onClearForceSourcesClick);
}

module.exports = wireMainControls;
