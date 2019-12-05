import { Project } from '../types';
import { renderEditor } from '../dom/render-editor';
import { renderMap } from '../dom/render-map';
var { updateProject } = require('../store');

function projectsFlow({
  projectData,
  selectedProjectId,
  onSelectProject,
  onInvalidateProjects
}: {
  projectData: Array<Project>;
  selectedProjectId: string;
  onSelectProject: (string) => void;
  onInvalidateProjects: () => void;
}) {
  var selectedProject = projectData.find(idIsSelected);

  renderEditor({ project: selectedProject, onChangeProject });
  renderMap({ projectData, selectedProject, onSelectProject });

  function idIsSelected(project: Project) {
    return project.id === selectedProjectId;
  }

  function onChangeProject(project: Project) {
    updateProject(project);
    onInvalidateProjects();
  }
}

module.exports = projectsFlow;
