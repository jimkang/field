import { Project, Attractor, Thing } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var { drag } = require('d3-drag');

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

  renderThings(projectData, 'project', onSelectProject, selectedProject);
  renderThings(
    attractorData,
    'attractor',
    onSelectAttractor,
    selectedAttractor
  ).call(applyDragBehavior);

  function updateAttractorPosition(attractor) {
    attractor.position[0] += d3.event.dx;
    attractor.position[1] += d3.event.dy;
    d3.select(this).attr('transform', getTransform(attractor));
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
  return `translate(${getX(thing)}, ${getY(thing)})`;
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
