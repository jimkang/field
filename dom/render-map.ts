import { Project, Attractor, Thing } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var { drag } = require('d3-drag');
var { forceSimulation } = require('d3-force');

var simulation;

export function renderMap({
  projectData,
  attractorData,
  selectedProject,
  selectedAttractor,
  onSelectProject,
  onSelectAttractor,
  onChangeAttractor
}: {
  projectData: Array<Project>;
  attractorData: Array<Attractor>;
  selectedProject: Project;
  selectedAttractor: Attractor;
  onSelectProject: (Project) => void;
  onSelectAttractor: (Attractor) => void;
  onChangeAttractor: (Attractor) => void;
}) {
  var applyDragBehavior = drag()
    .container(d3.select('#board').node())
    .on('end', onChangeAttractor)
    .on('drag', updateAttractorPosition);

  if (!simulation) {
    simulation = forceSimulation();
  }
  simulation.force('attractors', updateProjectChitPositions);
  simulation.nodes(projectData);
  simulation.on('tick', renderProjectChits);

  renderThings(
    attractorData,
    'attractor',
    onSelectAttractor,
    selectedAttractor
  ).call(applyDragBehavior);

  function renderProjectChits() {
    renderThings(projectData, 'project', onSelectProject, selectedProject);
  }

  function updateAttractorPosition(attractor) {
    attractor.x += d3.event.dx;
    attractor.y += d3.event.dy;
    d3.select(this).attr('transform', getTransform(attractor));
  }

  function updateProjectChitPositions(alpha) {
    var chits = projectData;
    for (var i = 0, n = chits.length, chit, k = alpha * 0.1; i < n; ++i) {
      chit = chits[i];
      chit.vx -= chit.x * k;
      chit.vy -= chit.y * k;
    }
  }
}

function renderThings(
  thingData: Array<Thing>,
  className: string,
  onSelectThing: (Thing) => void,
  selectedThing: Thing
) {
  var thingRoot = d3.select(`#${className}-root`);
  var things = thingRoot.selectAll('.' + className).data(thingData, accessor());
  things.exit().remove();
  var newThings = things
    .enter()
    .append('g')
    .classed(className, true)
    .classed('chit', true)
    .on('click', onClickThing);

  newThings
    .append('circle')
    .attr('r', 5)
    .attr('cx', 5)
    .attr('cy', 5);
  newThings
    .append('text')
    .classed('name', true)
    .attr('x', 5)
    .attr('y', 5);

  var currentThings = newThings.merge(things);
  currentThings.select('.name').text(accessor('name'));
  currentThings.attr('transform', getTransform);
  currentThings.classed('selected', isSelected);

  return currentThings;

  function isSelected(thing: Thing) {
    return selectedThing && thing.id === selectedThing.id;
  }

  function onClickThing(thing: Thing) {
    if (className === 'project') {
      onSelectThing({ projectId: thing.id });
    } else if (className === 'attractor') {
      onSelectThing({ attractorId: thing.id });
    } else {
      throw Error('Unknown Thing was clicked.');
    }
  }
}

function getTransform(thing: Thing) {
  return `translate(${thing.x}, ${thing.y})`;
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
