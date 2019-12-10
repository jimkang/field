import { Project, Attractor, ThingType } from '../types';
import { renderEditor } from '../dom/render-editor';
import { renderMap } from '../dom/render-map';
var { update } = require('../store');
var curry = require('lodash.curry');

function projectsFlow({
  projectData,
  attractorData,
  selectedProjectId,
  selectedAttractorId,
  onSelectProject,
  onSelectAttractor,
  onInvalidateProjects
}: {
  projectData: Array<Project>;
  attractorData: Array<Attractor>;
  selectedProjectId: string;
  selectedAttractorId: string;
  onSelectProject: (string) => void;
  onSelectAttractor: (string) => void;
  onInvalidateProjects: () => void;
}) {
  var selectedProject = projectData.find(
    curry(idIsSelected)(selectedProjectId)
  );
  var selectedAttractor = attractorData.find(
    curry(idIsSelected)(selectedAttractorId)
  );

  renderEditor({
    thing: selectedProject,
    thingType: ThingType.project,
    onChange: onChangeProject
  });
  renderEditor({
    thing: selectedAttractor,
    thingType: ThingType.attractor,
    onChange: onChangeAttractor
  });

  renderMap({
    projectData,
    attractorData,
    selectedProject,
    selectedAttractor,
    onSelectProject,
    onSelectAttractor
  });

  function idIsSelected(targetId: string, thing: Project | Attractor) {
    return thing.id === targetId;
  }

  function onChangeProject(project: Project) {
    update('project', project);
    onInvalidateProjects();
  }

  function onChangeAttractor(attractor: Attractor) {
    update('attractor', attractor);
  }
}

module.exports = projectsFlow;
