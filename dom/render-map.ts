import { Project } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');

var projectRoot = d3.select('#project-root');

export function renderMap({
  projectData,
  selectedProject,
  onSelectProject
}: {
  projectData: Array<Project>;
  selectedProject: Project;
  onSelectProject: (Project) => void;
}) {
  var projects = projectRoot
    .selectAll('.project')
    .data(projectData, accessor());
  projects.exit().remove();
  var newProjects = projects
    .enter()
    .append('g')
    .classed('project', true)
    .classed('chit', true)
    .on('click', onClickProject);

  newProjects
    .append('circle')
    .attr('r', 5)
    .attr('cx', 5)
    .attr('cy', 5);
  newProjects
    .append('text')
    .classed('project-name', true)
    .attr('x', 5)
    .attr('y', 5);

  var currentProjects = newProjects.merge(projects);
  currentProjects.select('.project-name').text(accessor('name'));
  currentProjects.attr('transform', getTransform);
  currentProjects.classed('selected', isSelected);

  function getTransform(project: Project) {
    return `translate(${getX(project)}, ${getY(project)})`;
  }

  function getX(project: Project) {
    // Arbitrary.
    return +project.lastUpdated.getTime() % 100;
  }

  function getY(project: Project) {
    // Arbitrary.
    return +project.created.getTime() % 100;
  }

  function isSelected(project: Project) {
    return project.id === selectedProject.id;
  }

  function onClickProject(project: Project) {
    onSelectProject({ projectId: project.id });
  }
}
