import { Project, Attractor, Thing } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');

export function renderMap({
  projectData,
  attractorData,
  selectedProject,
  selectedAttractor,
  onSelectProject,
  onSelectAttractor
}: {
  projectData: Array<Project>;
  attractorData: Array<Attractor>;
  selectedProject: Project;
  selectedAttractor: Attractor;
  onSelectProject: (Project) => void;
  onSelectAttractor: (Attractor) => void;
}) {
  renderThings(projectData, 'project', onSelectProject, selectedProject);
  renderThings(
    attractorData,
    'attractor',
    onSelectAttractor,
    selectedAttractor
  );
}

function renderThings(
  thingData: Array<Thing>,
  className: string,
  onSelectThing: (Thing) => void,
  selectedThing: Thing
) {
  var thingRoot = d3.select(`#${className}-root`);
  var things = thingRoot.selectAll('.thing').data(thingData, accessor());
  things.exit().remove();
  var newThings = things
    .enter()
    .append('g')
    .classed('thing', true)
    .classed('chit', true)
    .on('click', onClickThing);

  newThings
    .append('circle')
    .attr('r', 5)
    .attr('cx', 5)
    .attr('cy', 5);
  newThings
    .append('text')
    .classed('thing-name', true)
    .attr('x', 5)
    .attr('y', 5);

  var currentThings = newThings.merge(things);
  currentThings.select('.thing-name').text(accessor('name'));
  currentThings.attr('transform', getTransform);
  currentThings.classed('selected', isSelected);

  function getTransform(thing: Thing) {
    return `translate(${getX(thing)}, ${getY(thing)})`;
  }

  function isSelected(thing: Thing) {
    return thing.id === selectedThing.id;
  }

  function onClickThing(thing: Thing) {
    onSelectThing({ thingId: thing.id });
  }
}

function getX(thing: Thing) {
  return thing.position[0];
}

function getY(thing: Thing) {
  return thing.position[1];
}

/*
function getX(thing: Thing) {
  // Arbitrary.
  return +thing.lastUpdated.getTime() % 100;
}

function getY(thing: Thing) {
  // Arbitrary.
  return +thing.created.getTime() % 100;
}
*/
