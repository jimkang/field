// This needs to be pre-built (run `make build`, even
// if you're running wzrd.

var { forceSimulation, forceCollide } = require('d3-force');

var simulation;
const minIntervalForRestartingSim = 100;
var posLastUpdatedTime = 0.0;

onmessage = function simulationWorker(e) {
  var {
    projectData,
    forceSourceData,
    thingRadius,
    simulationNeedsRestart,
    restartTimeStamp
  } = e.data;

  if (!simulation) {
    simulation = forceSimulation();
    simulationNeedsRestart = false;
  }
  simulation
    .force('forceSources', updateProjectChitVelocities)
    //.velocityDecay(0)
    //.alphaDecay(0)
    .force('separation', forceCollide(thingRadius).strength(0.3))
    .alpha(0.1)
    .nodes(projectData.concat(forceSourceData))
    .on('tick', notify);

  if (simulationNeedsRestart) {
    if (isNaN(restartTimeStamp)) {
      restartTimeStamp = minIntervalForRestartingSim + 1;
      restartSimulationInEarnest(restartTimeStamp);
    }
  }

  function notify() {
    postMessage({ simEvent: 'tick', projectData, forceSourceData });
  }

  function updateProjectChitVelocities(alpha) {
    var projects = projectData;
    for (var i = 0, n = projects.length, project, k = alpha; i < n; ++i) {
      project = projects[i];
      for (let j = 0; j < forceSourceData.length; ++j) {
        let forceSource = forceSourceData[j];
        const attraction = getAttraction(forceSource, project);
        const xDiff = forceSource.x - project.x;
        const yDiff = forceSource.y - project.y;
        project.vx += xDiff * k * attraction;
        project.vy += yDiff * k * attraction;
      }
    }
  }
};

function getAttraction(forceSource, project) {
  var attraction = 0.0;
  for (var i = 0; i < forceSource.numberProps.length; ++i) {
    let forceSourceProp = forceSource.numberProps[i];
    for (let j = 0; j < project.numberProps.length; ++j) {
      let projectProp = project.numberProps[j];
      if (projectProp.name === forceSourceProp.name) {
        attraction += 1.0 - Math.abs(projectProp.value - forceSourceProp.value);
      }
    }
  }
  return attraction;
}

function restartSimulationInEarnest(restartTimeStamp) {
  if (restartTimeStamp - posLastUpdatedTime >= minIntervalForRestartingSim) {
    posLastUpdatedTime = restartTimeStamp;
    simulation.alpha(1);
    simulation.restart();
  }
}
