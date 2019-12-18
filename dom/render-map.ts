import { Project, Attractor, Thing, NumberProp } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var { drag } = require('d3-drag');
var { forceSimulation, forceCollide } = require('d3-force');

var simulation;

export function renderMap({
  projectData,
  attractorData,
  selectedProject,
  selectedAttractor,
  thingRadius = 5,
  onSelectProject,
  onSelectAttractor,
  onChangeAttractor
}: {
  projectData: Array<Project>;
  attractorData: Array<Attractor>;
  selectedProject: Project;
  selectedAttractor: Attractor;
  thingRadius?: number;
  onSelectProject: (Project) => void;
  onSelectAttractor: (Attractor) => void;
  onChangeAttractor: (Attractor) => void;
}) {
  var applyDragBehavior = drag()
    .container(d3.select('#board').node())
    .on('end', onChangeAttractor)
    .on('drag', updateAttractorPosition);

  var simulationNeedsRestart = true;
  if (!simulation) {
    simulation = forceSimulation();
    simulationNeedsRestart = false;
  }
  simulation
    .force('attractors', updateProjectChitVelocities)
    .force('separation', forceCollide(thingRadius))
    .nodes(projectData)
    .on('tick', renderProjectChits);
  if (simulationNeedsRestart) {
    restartSimulationInEarnest();
  }

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
    restartSimulationInEarnest();
  }

  function restartSimulationInEarnest() {
    simulation.alpha(1);
    simulation.restart();
  }

  function updateProjectChitVelocities(alpha) {
    var projects = projectData;
    for (var i = 0, n = projects.length, project, k = alpha * 0.1; i < n; ++i) {
      project = projects[i];
      for (let j = 0; j < attractorData.length; ++j) {
        let attractor = attractorData[j];
        const attraction = getAttraction(attractor, project);
        const xDiff = attractor.x - project.x - 2 * thingRadius;
        const yDiff = attractor.y - project.y - 2 * thingRadius;
        project.vx += xDiff * k * attraction;
        project.vy += yDiff * k * attraction;
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
    var things = thingRoot
      .selectAll('.' + className)
      .data(thingData, accessor());
    things.exit().remove();
    var newThings = things
      .enter()
      .append('g')
      .classed(className, true)
      .classed('chit', true)
      .on('click', onClickThing);

    newThings
      .append('circle')
      .attr('r', thingRadius)
      .attr('cx', thingRadius)
      .attr('cy', thingRadius);
    newThings
      .append('text')
      .classed('name', true)
      .attr('x', thingRadius)
      .attr('y', thingRadius);

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
}

function getTransform(thing: Thing) {
  return `translate(${thing.x}, ${thing.y})`;
}

function getAttraction(attractor: Attractor, project: Project): number {
  var attraction = 0.0;
  for (var i = 0; i < attractor.numberProps.length; ++i) {
    let attractorProp: NumberProp = attractor.numberProps[i];
    for (let j = 0; j < project.numberProps.length; ++j) {
      let projectProp: NumberProp = project.numberProps[j];
      if (projectProp.name === attractorProp.name) {
        attraction +=
          (1.0 - Math.abs(projectProp.value - attractorProp.value)) /
          attractor.numberProps.length;
      }
    }
  }
  return attraction;
}
