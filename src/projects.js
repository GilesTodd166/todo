function buildProjectElement(project, index) {

    const projectDiv = document.createElement('div');
        projectDiv.classList = 'project-div';
        projectDiv.setAttribute('data-index', index);
        projectDiv.setAttribute('data-id', project.id);

        const projectLi = document.createElement('li');
            projectLi.textContent = project.title;
            projectLi.classList = 'project-name';
                projectLi.setAttribute('data-index', index);
                projectLi.setAttribute('data-id', project.id);
                    projectDiv.appendChild(projectLi);

        const closeProject = document.createElement('div');
            closeProject.className = 'close-icon';
            closeProject.setAttribute('data-index', index);
                closeProject.setAttribute('data-id', project.id);
                    projectDiv.appendChild(closeProject);

    return projectDiv;
};

export { buildProjectElement };