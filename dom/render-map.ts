import { Project, ForceSource, Thing } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var { drag } = require('d3-drag');
var { zoom } = require('d3-zoom');
var getAtPath = require('get-at-path');

var simulationWorker = new Worker('simulation-worker.js');
var boardSel = d3.select('#board');
var zoomRootSel = d3.select('#zoom-root');

var zoomer = zoom().on('zoom', onZoom);
boardSel.call(zoomer);

var animationRequestId;

export function renderMap({
  projectData,
  forceSourceData,
  selectedProject,
  selectedForceSource,
  thingRadius = 5,
  onSelectProject,
  onSelectForceSource,
  onChangeForceSource
}: {
  projectData: Array<Project>;
  forceSourceData: Array<ForceSource>;
  selectedProject: Project;
  selectedForceSource: ForceSource;
  thingRadius?: number;
  onSelectProject: (Project) => void;
  onSelectForceSource: (ForceSource) => void;
  onChangeForceSource: (ForceSource) => void;
}) {
  var applyDragBehavior = drag()
    .container(boardSel.node())
    .on('end', onChangeForceSource)
    .on('drag', updateForceSourcePosition);

  simulationWorker.postMessage({ projectData, forceSourceData, thingRadius });
  simulationWorker.onmessage = onWorkerMessage;

  renderThings(
    forceSourceData,
    'forceSource',
    onSelectForceSource,
    selectedForceSource
  ).call(applyDragBehavior);

  function onWorkerMessage(e) {
    const simEvent = getAtPath(e, ['data', 'simEvent']);
    if (simEvent === 'tick') {
      if (e.data.projectData) {
        projectData = e.data.projectData;
      }
      if (animationRequestId) {
        window.cancelAnimationFrame(animationRequestId);
      }
      animationRequestId = window.requestAnimationFrame(renderProjectChits);
    }
  }

  function renderProjectChits() {
    renderThings(projectData, 'project', onSelectProject, selectedProject);
  }

  function updateForceSourcePosition(forceSource) {
    forceSource.fx += d3.event.dx;
    forceSource.fy += d3.event.dy;
    d3.select(this).attr('transform', getTransform(forceSource));
    renderProjectChits();

    simulationWorker.postMessage({
      projectData,
      forceSourceData,
      thingRadius,
      restartSimulationInEarnest: true,
      restartTimeStamp: d3.event.timeStamp
    });
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
      .append('foreignObject')
      .attr('width', thingRadius * 2)
      .attr('height', thingRadius * 2)
      // Never forget: Using the namespace when appending an html
      // element to a foreignObject is incredibly important. Without it,
      // a div will not size itself correctly for its contents.
      .append('xhtml:div')
      .classed('name-container', true)
      .append('xhtml:div')
      .classed('name', true);

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
      } else if (className === 'forceSource') {
        onSelectThing({ forceSourceId: thing.id });
      } else {
        throw Error('Unknown Thing was clicked.');
      }
    }
  }
}

function getTransform(thing: Thing) {
  return `translate(${thing.x}, ${thing.y})`;
}

function onZoom() {
  zoomRootSel.attr('transform', d3.event.transform);
}
