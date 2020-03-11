import {
  Project,
  ForceSource,
  ThingType,
  Thing,
  NumberProp,
  StringProp
} from '../types';
import { renderEditor } from '../dom/render-editor';
import { renderMap } from '../dom/render-map';
// TODO: Update projectsFlow to not assume a singleton store
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
  onInvalidate
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
    onAddTag,
    onDeleteThing: onDeleteProject
  });
  renderEditor({
    thing: selectedForceSource,
    thingType: ThingType.forceSource,
    onChange: onChangeForceSource,
    onAddProp,
    onAddTag,
    onDeleteThing: onDeleteForceSource
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
    update(thing.thingType, thing);
    onInvalidate();
  }

  function onAddTag(thing: Thing) {
    var tag: StringProp = {
      id: `tag-${randomId(4)}`,
      value: 'Cool new tag'
    };
    thing.tags.push(tag);
    update(thing.thingType, thing);
    onInvalidate();
  }

  function onDeleteProject(project: Project) {
    deleteThing('project', project);
    onSelectProject({ projectId: undefined });
  }

  function onDeleteForceSource(forceSource: ForceSource) {
    deleteThing('forceSource', forceSource);
    onSelectForceSource({ forceSourceId: undefined });
  }
}

module.exports = projectsFlow;
