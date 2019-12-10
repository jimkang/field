var OLPE = require('one-listener-per-element');
var { on } = OLPE();

function wireControls({
  onAddProjectClick,
  onClearProjectsClick,
  onAddAttractorClick,
  onClearAttractorsClick
}) {
  on('#add-project-button', 'click', onAddProjectClick);
  on('#clear-projects-button', 'click', onClearProjectsClick);
  on('#add-attractor-button', 'click', onAddAttractorClick);
  on('#clear-attractors-button', 'click', onClearAttractorsClick);
}

module.exports = wireControls;
