import { Project } from './types';

// Singleton.

// Load from localStorage when the module is loaded.
var projectDict: Record<string, Project> = {};

if (window.localStorage.projects) {
  try {
    projectDict = JSON.parse(localStorage.projects);
    for (var id in projectDict) {
      inflateDates(projectDict[id]);
    }
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

function inflateDates(project: Project) {
  project.lastUpdated = inflateDateValue(project.lastUpdated);
  project.created = inflateDateValue(project.created);
}

function inflateDateValue(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    return new Date(value);
  }
}

module.exports = {
  updateProject,
  getProjects,
  clearProjects,
  saveProjects
};
