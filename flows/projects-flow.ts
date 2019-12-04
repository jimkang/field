import { Project } from '../types';
import { renderEditor } from '../dom/render-editor';
var { updateProject } = require('../store');

function projectsFlow({
  projectData,
  selectedProjectId
}: {
  projectData: Array<Project>;
  selectedProjectId: string;
}) {
  var selectedProject = projectData.find(idIsSelected);
  renderEditor({ project: selectedProject, onChangeProject });

  function idIsSelected(project: Project) {
    return project.id === selectedProjectId;
  }

  function onChangeProject(project: Project) {
    updateProject(project);
  }
}

module.exports = projectsFlow;
