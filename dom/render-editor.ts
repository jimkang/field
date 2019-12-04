import { Project } from '../types';
var cloneDeep = require('lodash.clonedeep');
var StrokeRouter = require('strokerouter');
var d3 = require('d3-selection');

var strokeRouter = StrokeRouter(document);
var nameField = d3.select('.project-editor .project-name');

export function renderEditor({
  project,
  onChangeProject
}: {
  project: Project;
  onChangeProject: (Project) => void;
}) {
  renderNameField(project, updateName);

  function updateName(newText) {
    var copy = cloneDeep(project);
    copy.name = newText;
    onChangeProject(copy);
  }
}

function renderNameField(project: Project, updateName) {
  var editing = false;
  var initialValue = '';

  // Disconnect old event listeners.
  nameField.on('blur.name', null);
  nameField.on('click.name', null);
  strokeRouter.unrouteKeyUp('escape', null);
  strokeRouter.unrouteKeyUp('enter', ['ctrl']);
  strokeRouter.unrouteKeyUp('enter', ['meta']);

  // Update field value.
  nameField.text(project.name);

  // Connect current listeners.
  nameField.on('blur.name', endEditing);
  nameField.on('click.name', startEditing);

  strokeRouter.routeKeyUp('escape', null, cancelEditing);
  strokeRouter.routeKeyUp('enter', ['ctrl'], endEditing);
  strokeRouter.routeKeyUp('enter', ['meta'], endEditing);

  function startEditing() {
    nameField.classed('editing', true);
    initialValue = nameField.text();
    editing = true;
  }

  function endEditing() {
    if (editing) {
      nameField.classed('editing', false);
      updateName(nameField.text());
      editing = false;
    }
  }

  function cancelEditing() {
    if (editing) {
      nameField.classed('editing', false);
      nameField.text(initialValue);
      editing = false;
    }
  }
}
