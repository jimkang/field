import { Project, ForceSource, ThingType, Thing, NumberProp } from '../types';
import { renderEditor } from '../dom/render-editor';
import { renderMap } from '../dom/render-map';
var { update, deleteThing } = require('../store');
var curry = require('lodash.curry');
var randomId = require('@jimkang/randomid')();

function projectsFlow({
  projectData,
  forceSourceData,
  selectedProjectId,
  selectedForceSourceId,
  onSelectProject,
  onSelectForceSource,
  onInvalidate,
  showProjectEditor,
  showForceSourceEditor
}: {
  projectData: Array<Project>;
  forceSourceData: Array<ForceSource>;
  selectedProjectId: string;
  selectedForceSourceId: string;
  onSelectProject: (string) => void;
  onSelectForceSource: (string) => void;
  onInvalidate: () => void;
  showProjectEditor: boolean;
  showForceSourceEditor: boolean;
}) {
  var selectedProject = projectData.find(
    curry(idIsSelected)(selectedProjectId)
  );
  var selectedForceSource = forceSourceData.find(
    curry(idIsSelected)(selectedForceSourceId)
  );

  renderEditor({
    thing: selectedProject,
    thingType: ThingType.project,
    onChange: onChangeProject,
    onAddProp,
    onDeleteThing: onDeleteProject,
    visible: showProjectEditor
  });
  renderEditor({
    thing: selectedForceSource,
    thingType: ThingType.forceSource,
    onChange: onChangeForceSource,
    onAddProp,
    onDeleteThing: onDeleteForceSource,
    visible: showForceSourceEditor
  });

  renderMap({
    projectData,
    forceSourceData,
    selectedProject,
    selectedForceSource,
    onSelectProject,
    onSelectForceSource,
    onChangeForceSource
  });

  function idIsSelected(targetId: string, thing: Project | ForceSource) {
    return thing.id === targetId;
  }

  function onChangeProject(project: Project) {
    update('project', project);
    onInvalidate();
  }

  function onChangeForceSource(forceSource: ForceSource) {
    update('forceSource', forceSource);
    onInvalidate();
  }

  function onAddProp(thing: Thing) {
    var prop: NumberProp = {
      name: `${randomId(4)}-ness`,
      value: 0.5
    };
    thing.numberProps.push(prop);
    onInvalidate();
  }

  function onDeleteProject(project: Project) {
    deleteThing('project', project);
    onInvalidate();
  }

  function onDeleteForceSource(forceSource: ForceSource) {
    deleteThing('forceSource', forceSource);
    onInvalidate();
  }
}

module.exports = projectsFlow;
