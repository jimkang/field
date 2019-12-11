import { Project, Attractor, ThingType, Thing, NumberProp } from '../types';
import { renderEditor } from '../dom/render-editor';
import { renderMap } from '../dom/render-map';
var { update } = require('../store');
var curry = require('lodash.curry');
var randomId = require('@jimkang/randomid')();

function projectsFlow({
  projectData,
  attractorData,
  selectedProjectId,
  selectedAttractorId,
  onSelectProject,
  onSelectAttractor,
  onInvalidate
}: {
  projectData: Array<Project>;
  attractorData: Array<Attractor>;
  selectedProjectId: string;
  selectedAttractorId: string;
  onSelectProject: (string) => void;
  onSelectAttractor: (string) => void;
  onInvalidate: () => void;
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
    onChange: onChangeProject,
    onAddProp
  });
  renderEditor({
    thing: selectedAttractor,
    thingType: ThingType.attractor,
    onChange: onChangeAttractor,
    onAddProp
  });

  renderMap({
    projectData,
    attractorData,
    selectedProject,
    selectedAttractor,
    onSelectProject,
    onSelectAttractor,
    onChangeAttractor
  });

  function idIsSelected(targetId: string, thing: Project | Attractor) {
    return thing.id === targetId;
  }

  function onChangeProject(project: Project) {
    update('project', project);
    onInvalidate();
  }

  function onChangeAttractor(attractor: Attractor) {
    update('attractor', attractor);
    onInvalidate();
  }

  function onAddProp(thing: Thing) {
    var prop: NumberProp = {
      name: `${randomId(4)}-ness`,
      value: 0.5
    };
    thing.numberPropsByName[prop.name] = prop;
    onInvalidate();
  }
}

module.exports = projectsFlow;
