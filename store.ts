import { Project } from './types';

// Singleton.

// Load from localStorage when the module is loaded.
var projectDict: Record<string, Project> = {};

if (window.localStorage.projects) {
  try {
    projectDict = JSON.parse(localStorage.projects);
  } catch (e) {
    console.log(e, e.stack);
  }
}

function updateProject(project: Project) {
  projectDict[project.id] = project;
  saveProjects();
}

function saveProjects() {
  localStorage.projects = JSON.stringify(projectDict);
}

function getProjects(): Array<Project> {
  return Object.values(projectDict);
}

function clearProjects() {
  projectDict = {};
  saveProjects();
}

module.exports = {
  updateProject,
  getProjects,
  clearProjects,
  saveProjects
};
