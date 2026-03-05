import "./styles.css";
import { parse, parseISO, format } from "date-fns";
import blackCircle from "./media/icons/add_circle_black.svg";

import { Project, allProjects, addProject, removeProject, getProjectById, getTasksWithTag, allTags } from "./classes.js";
import { buildTaskElement } from "./tasks.js";
import { buildProjectElement } from "./projects.js";
import { buildTags } from "./tags.js";


// ------ STATE ------
let tagsList = allTags;
let currentProject = allProjects[0];
let currentTask = null;
let deleteContext = {
    type: null,
    id: null
};
window.currentProject = currentProject;


// ------ CONSTS -------

// Consts for populating mainContent and sideProjects.
const mainContent = document.querySelector('.main-content');
const sideProjects = document.querySelector('.side-projects');

// Consts for Modals
const deleteModal = document.querySelector('.delete-modal');
const delButton = document.querySelector('.delete-btn');
const delModalHeader = document.querySelector('.modal-header-h1');
const delModalText = document.querySelector('.modal-text');
const delModalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('.modal-content');
const parentHeader = document.getElementById('parent-header');
const taskModal = document.querySelector('.task-modal');
const submitButton = document.querySelector('.modal-save-btn');
const taskDeleteBtn = document.querySelector('.task-delete');
const commentsModal = document.getElementById('modal-comments');
const tagsModal = document.getElementById('modal-tags');
const sideBar = document.querySelector('.sidebar');
const projectModal = document.querySelector('.project-modal');
const projectSubmitButton = document.querySelector('.project-save-btn');
const tagModal = document.querySelector('.tag-modal');
const tagForm = document.getElementById('tag-form');
const tagHeader = document.querySelector('.tags-header');
const sideTags = document.querySelector('.side-tags');
const delTagModal = document.querySelector('.delete-tag-modal');

// Form Consts
const taskForm = document.getElementById('task-form');
const projectForm = document.getElementById('project-form');
const dateInput = document.getElementById('task-date');
const taskTags = document.getElementById('task-tags');

// ------ FUNCTIONS ------

// Render tags in tags sidebar
function renderTags(tags) {
    
    tagHeader.innerHTML = '<h3 class="tags-header">Tags</h3>';

    if (!tags) {
        tagHeader.innerHTML = '<h3 class="tags-header">Tags</h3>';
            return;
    }
    tags.forEach((tag, index) => {
        const tagElement = buildTags(tag, index);
        tagHeader.append(tagElement);
    });
};

// Render the tasks within each project to mainContent.
function renderTask(project) {
    // Check if project exists otherwise return;
    if (!project) {
        mainContent.innerHTML = '';
        parentHeader.innerHTML = '';
            return;
    }
    // Clear mainContent before re rendering
        mainContent.innerHTML = '';

    //Update Headers
        parentHeader.innerHTML = `${project.title}`;

    // Create Project header, main-line and section.
    const projectHeader = document.createElement('h1');
        projectHeader.textContent = `${project.title}`;
            mainContent.append(projectHeader);

    const mainLine = document.createElement('div');
        mainLine.setAttribute('class', 'main-line');
            mainContent.append(mainLine);

    const section = document.createElement('div');
        section.setAttribute('class', 'section');
            mainContent.append(section);

    // Loop over each task and display results.
    project.tasks.forEach((task) => {
        const taskElement = buildTaskElement(task);
            section.append(taskElement);
    });

    const endLine = document.createElement('div');
        endLine.setAttribute('class', 'end-line');
            mainContent.append(endLine);

    // Add Task Button
    const mainTaskBtn = document.createElement('div');
        mainTaskBtn.setAttribute('id', 'mainTaskBtn');
        mainTaskBtn.setAttribute('class', 'add-task');
        mainTaskBtn.innerHTML = '<span class="add-task-event">Add Task</span>';
            mainContent.append(mainTaskBtn);
    const taskImg = document.createElement('img');
        taskImg.src = blackCircle;
        taskImg.setAttribute('class', 'task-icon add-task-event');
            mainTaskBtn.append(taskImg);
};

// Render all projects
function renderProjects() {
    // Clear sideProjects for re render.
    sideProjects.innerHTML = '<h3 class="projects-header">My Projects</h3>';

    // Might be able to remove index from this forEach when id is used to load delModal etc.
    allProjects.forEach((project, index) => {
        const projectElement = buildProjectElement(project, index);

        // Fire sort Array function
        sortArrayPriority(currentProject);

            sideProjects.append(projectElement);
    });
};

// Sort array comparing High and Medium, Low is default last in order
function sortArrayPriority(currentProject) {

    let tasksArr = currentProject.tasks;
            tasksArr.sort((a, b) => 
            (b.priority === "High") - (a.priority === "High") ||
            (b.priority === "Medium") - (a.priority === "Medium") ||
            a > b || -(a < b)
        );
};

function openDelModal(id, type) {
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');

    if (type === 'Project') {
        let targetProject = getProjectById(allProjects, id);
        // delModalHeader.innerHTML = `<h1>Delete Project</h1>`;
        // delModalText.innerHTML = `<p>Are you sure you want to delete this project?</p>`;
        // delModalTitle.innerHTML = `<h3>${targetProject.title}</h3>`;
        updateModal(targetProject.title, type);
            deleteContext.type = "Project";
            deleteContext.id = id;
    } else if (type === 'Tag') {
        let tagName = allTags.getTagById(id);
        // delModalHeader.innerHTML = `<h1>Delete Tag</h1>`;
        // delModalText.innerHTML = `<p>Are you sure you want to delete this tag?</p>`;
        // delModalTitle.innerHTML = `<h3>${tagName.name}</h3>`;
        updateModal(tagName.name, type);
            deleteContext.type = "Tag";
            deleteContext.id = id;
    } else {
        // delModalTitle.innerHTML = `<h3>${currentTask.title}</h3>`;
        // delModalHeader.innerHTML = `<h1>Delete Task</h1>`;
        // delModalText.innerHTML = `<p>Are you sure you want to delete this task?</p>`;
        updateModal(currentTask.title, type);
            deleteContext.type = "Task";
            deleteContext.id = id;
    };
};

function updateModal(title, type) {
    delModalHeader.innerHTML = `<h1>Delete ${type}</h1>`;
    delModalText.innerHTML = `<p>Are you sure you want to delete this ${type}?</p>`;
    delModalTitle.innerHTML = `<h3>${title}</h3>`;
};

function openTagDelModal(tagIndex) {
    delTagModal.style.display = 'block';
    document.body.classList.add('modal-open');

    delModalTitle.innerHTML = `<h3>${tagIndex}</h3>`;

};

function deleteProjectOrTask(deleteContext) {
    const targetId = deleteContext.id;

    // Delete project functionality.
    if (deleteContext.type === 'Project') {
        const getTargetProjectById = getProjectById(allProjects, targetId);

            // Convert toString to match format of id in allProjects.
            let targetToString = getTargetProjectById.id.toString();
            removeProject(targetToString);

                // Re render projects and tasks with new currentProject.
                currentProject = allProjects[0];
                    renderProjects();
                    renderTask(currentProject);
                        closeModal();
    // Delete task functionality
    } else if (deleteContext.type === 'Task') {
        currentProject.removeTask(targetId);
            renderTask(currentProject);
                closeModal();

    // Delete tag functionality
    } else {
    let targetTagString = targetId.toString();
        tagsList.removeTag(targetTagString);
            closeModal();
                renderTags(tagsList.tagsArr);
    };
};

function closeModal() {
    deleteModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    taskModal.style.display = 'none';
    deleteModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    // resetForm after editing form is closed and add comments header back.
    taskForm.reset();
        commentsModal.innerHTML = '<label class="label-text" for="task-comments">Saved Comments:</label>';

};

function saveModal(taskId) {
    if (taskId === undefined) {
        closeModal();
    } else {
        // Saving task functionality here using taskId passed in.
        closeModal();
    };
};

function openTaskModal(taskId) {
    taskModal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Attach task-id to submit button on modal task form.
    // Might not need this is using currentTask as reference but its here for now on submit button.
    submitButton.setAttribute('data-task-id', `${taskId}`);

    // Attach id to submit and delete buttons in task modal.
    taskDeleteBtn.setAttribute('data-task-id', `${taskId}`);

    // Load current tags list as array.
    loadCurrentTags(tagsList.tagsArr);
};

function loadCurrentTags(tagsArray) {
    // Clear tags list and reload from tagsArray.
    taskTags.innerHTML = '';

    // Add default blank option to start
    const blankOption = document.createElement('option');
        blankOption.textContent = 'Select a relevant tag';
        blankOption.selected = true;
        blankOption.disabled = true;
            taskTags.append(blankOption);

        // STOP -- Above works but fires a null value as a new tag if it
        // remains selected, i feel like this can be adjusted when tags
        // are loaded into the form for submitting? if null, change to empty
        // then fire. Check how saved comments being empty works?
        //
        // If add task modal is opened for a new task, pressing delete button fires an error.

    tagsArray.forEach(tag => {
        const option = document.createElement('option')
            option.textContent = tag.name;
            option.id = tag.id;
            option.name = tag.name;
                taskTags.appendChild(option);
    });
};

// Project Modal Functions
function openProjectModal() {
    projectModal.style.display = 'block';
    document.body.classList.add('modal-open');
};
function closeProjectModal() {
    projectModal.style.display = 'none';
    document.body.classList.remove('modal-open');
};

function submitProjectForm() {

    const projectFormData = new FormData(event.target);

    const projectTitle = projectFormData.get('project-name');

    // Instance of a new Project
    let newProject = new Project(projectTitle);

    addProject(newProject);

    currentProject = allProjects[0];

    renderProjects();

    renderTask(currentProject);

    closeProjectModal();
}

// Tag Modal Functions
function openTagModal() {
    tagModal.style.display = 'block';
    document.body.classList.add('modal-open');
};
function closeTagModal() {
    tagModal.style.display = 'none';
    document.body.classList.remove('modal-open');
};

function submitTagForm() {

    const tagFormData = new FormData(event.target);

    const tagName = tagFormData.get('tag-name');

    allTags.addTag(tagName);

    closeTagModal();

    renderTags(allTags.tagsArr);
};

// Populate form with unique task data for editing.
function populateForm(currentTask) {
    document.getElementById('task-name').value = currentTask.title;
    document.getElementById('task-desc').value = currentTask.description;
    // Pull date string, convert it to formatted date with date-fns
        const currentTaskDate = format(parse(currentTask.date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
    document.querySelector('input[type="date"]').value = currentTaskDate;
    document.forms["task-form"].elements["task-priority"].value = currentTask.priority;

        populateComments(currentTask);
        populateTags(currentTask);
};

function populateComments(currentTask) {

    commentsModal.innerHTML = '<label class="label-text" for="task-comments">Saved Comments:</label>';

    // Pull forEach over .comments and create a 'comment' in the DOM.
    let commentsArr = currentTask.comments;
    // Flatten comments array to single array.
    let allStrings = Array.isArray(commentsArr)
        ? commentsArr.flat(Infinity).filter(comment => typeof comment === 'string') : [];


    allStrings.forEach((comment, index) => {
        let commentsContainer = document.createElement('div');
            commentsContainer.className = 'comments-container';
                commentsContainer.setAttribute('data-index', index);
                    commentsModal.appendChild(commentsContainer);
        let commentDiv = document.createElement('div');
            commentDiv.className = 'saved-comment';
            commentDiv.textContent = comment;
                commentDiv.setAttribute('data-index', index);
                    commentsContainer.appendChild(commentDiv);
        let closeIcon = document.createElement('div');
            closeIcon.className = 'close-icon';
            closeIcon.setAttribute('id', 'close-icon');
                closeIcon.setAttribute('data-index', index);
                closeIcon.setAttribute('data-id', currentTask.id);
                    commentsContainer.appendChild(closeIcon);
        let modalLine = document.createElement('div');
            modalLine.className = 'comments-line';
                commentsModal.appendChild(modalLine);
    });
};

function populateTags(currentTask) {

    tagsModal.innerHTML = '<label class="label-text" for="task-tags">Saved Tags:</label>';

    let tagsArr = currentTask.tags;
    
    let tagStrings = Array.isArray(tagsArr) 
        ? tagsArr.flat(Infinity).filter(tag => typeof tag === 'string') : [];
    
    tagStrings.forEach((tag, index) => {
        let tagsContainer = document.createElement('div');
            tagsContainer.className = 'tags-container';
            tagsContainer.setAttribute('data-index', index);
                tagsModal.appendChild(tagsContainer);
        let tagDiv = document.createElement('div');
            tagDiv.className = 'saved-tag';
            tagDiv.textContent = tag;
            tagDiv.setAttribute('data-index', index);
                tagsContainer.appendChild(tagDiv);
        let closeIcon = document.createElement('div');
            closeIcon.className = 'close-tag';
            closeIcon.setAttribute('id', 'close-icon');
                closeIcon.setAttribute('data-index', index);
                // closeIcon.setAttribute('data-id', currentTask.tag);
                tagsContainer.appendChild(closeIcon);
        let modalLine = document.createElement('div');
            modalLine.className = 'comments-line';
                tagsModal.appendChild(modalLine);
    });

};

// Form Functions
function checkValidity(dateObj) {
    
        const today = new Date();
        // Sets clock to 00:00, aligns date to midnight to ensure its correct, otherwise
        // choosing todays date would count as in the past.
        today.setHours(0,0,0,0);

        // Reapplies the custom validity check.
        dateInput.setCustomValidity('');

        if (dateObj < today) {
            dateInput.setCustomValidity('This date is in the past.');
        };

        if (!taskForm.checkValidity()) {
            taskForm.reportValidity();
            console.log('failed validity');
            return false;
        };
        return true;
};

function addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId) {
    // Add new task or update existing task using task ID.
    console.log(taskId);
    if (taskId == 'undefined') {
        currentProject.addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments);
    } else {
        currentProject.addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);
    };

    // Sort new currentProject.
    sortArrayPriority(currentProject);
};

function submitForm() {
    // // Get task-id from attribute added when form loaded.
    const modalSaveBtn = document.querySelector('.modal-save-btn');
    let taskId = modalSaveBtn.getAttribute('task-id');

    let existingComments = document.querySelectorAll('.saved-comment');
    let existingTags = document.querySelectorAll('.saved-tag');
    // Convert nodelist of comments to array of textContent, removing whitespaces either end.
    let existingCommentsArray = Array.from(existingComments, item => item.textContent.trim());
    let existingTagsArray = Array.from(existingTags, item => item.textContent.trim());
            
    const formData = new FormData(event.target);
        const taskName = formData.get('task-name');
        const taskDesc = formData.get('task-desc');
        const formDate = formData.get('task-date');
        const taskPriority = formData.get('task-priority');
            // Pull new tags
            const newTags = formData.get('task-tags');
            // Push new tags to existing tags
            if (newTags === '') {
            } else {
                existingTagsArray.push(newTags);
            }
                // Update taskTags to use as arg for addOrEditTask
                const taskTags = existingTagsArray;

            // Pull new comments
            const newComments = formData.get('task-comments');
            // Push new comments to existing comments
            if (newComments === '') {
            } else {
                existingCommentsArray.push(newComments);
            } 
                // Update taskComments to use as arg for addOrEditTask
                const taskComments = existingCommentsArray;

            const dateObj = parseISO(formDate);

                // checkValidity() returns a true or false depending on validity check
                // if it returns false, this return statement stops the submit event.
                if (!checkValidity(dateObj)) return;

            let taskDate = format((dateObj), 'dd-MM-yyyy');

            // Set taskId to currentTask.id.
            taskId = currentTask.id;

    // Add or Edit task based formData and taskId
    addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);

        // Close modal window
        closeModal();

            // Re render task from project
            renderTask(currentProject);
};


// ------ EVENTS ------

// NOTE -- Can consolidate these event delegations as its applying sideBar delegation to sideProjects as its
//         as child of sideBar. Same if I create sideTags.addEventListener.

// Event Delegation for sideBar.
sideBar.addEventListener('click', (event) => {
    const target = event.target;

    // Add Task event
    if (target.classList.contains("add-task-event")) {
        openTaskModal();
    };
    // Add Project event 
    if (target.classList.contains("add-project-event")) {
        openProjectModal();
    };
    // Add Tag button event
    if (target.classList.contains("add-tag-event")) {
        openTagModal();
    };

    // Delete Tag icon event.
    if (target.classList.contains("close-tag")) {
        if (!target.dataset.id) return;

        const tagId = target.dataset.id;
        const type = 'Tag';

        openDelModal(tagId, type);
    };
});

// Event Delegation for sideProjects.
sideProjects.addEventListener('click', (event) => {
    const target = event.target;

        if (!target.dataset.index) return;

        const projectId = target.dataset.id;

        const getProject = getProjectById(allProjects, projectId);

        // Target the project name div
        if (target.classList.contains("project-name")) {
            currentProject = getProject;
            renderTask(getProject);
        };
        // Target the close icon
        if (target.classList.contains("close-icon")) {
            const type = 'Project';
                openDelModal(projectId, type);
        };
        // Add Project event
        if (target.classList.contains("add-project-event")) {
            openProjectModal();
        };
});

sideTags.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.dataset.id) return;

    const tagId = target.dataset.id;

    const getTag = allTags.getTagById(tagId);

    // I have the specific tag to load all posts of.
    // Iterate through each Project.tasks in order and render any tasks
    // that matches the tag name.

    // console.log(getTag.name);

    // Data send to classes.js to match tag against each task.
    getTasksWithTag(getTag.name);
    
    // Here build/render any returned tasks.
});

// Event Delegation for modalContent
modalContent.addEventListener('click', (event) => {
    const target = event.target;
    // Close icon function
    if (target.classList.contains("settings-icon")) {
        closeModal();
    };
    // Delete button functionality
    if (target.classList.contains("delete-btn")) {
        // Pass deleteContext from delModal to delete function.
        deleteProjectOrTask(deleteContext);
    };
    // Save button functionality
    if (target.classList.contains("save-btn")) {
        saveModal();
    };
});

// Event Delegation for projectModal and projectForm
projectModal.addEventListener('click', (event => {
    const target = event.target;
    // Close task modal window event
    if (target.classList.contains("settings-icon")) {
        closeProjectModal();
    };
    // Delete button event 
    if (target.classList.contains("delete-btn")) {
        closeProjectModal();
    };
}));
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitProjectForm();
});

// Event Delegation for tagModal and tagForm
tagModal.addEventListener('click', (event => {
    const target = event.target;
    // Close task modal window event
    if (target.classList.contains("settings-icon")) {
        closeTagModal();
    };
        // Delete button event 
    if (target.classList.contains("delete-btn")) {
        closeTagModal();
    };
}));
tagForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitTagForm();
});

//Event Delegation for mainContent
mainContent.addEventListener('click', (event) => {
    const target = event.target;
    let taskId = event.target.dataset.taskId;

    // Set currentTask state
    currentTask = currentProject.getTask(taskId);

        // Add Task button event
        if (target.classList.contains("add-task-event")) {
            openTaskModal();
        };
        // Edit Task event
        if (target.classList.contains("edit-event")) {

                openTaskModal(currentTask.id);

                populateForm(currentTask);
        };
        // Delete task event
        if (event.target.classList.contains("delete-event")) {
            const type = 'Task';
            openDelModal(taskId, type);
        }
});

// Event Delegation for taskModal
taskModal.addEventListener('click', (event) => {
    const target = event.target;

    let taskId = event.target.dataset.taskId;


    // Delete comments event
    if (target.classList.contains("close-icon")) {
        const commentIndex = event.target.dataset.index;

        currentProject.removeComment(currentTask, commentIndex);

        populateForm(currentTask);
    };
    // Close task modal window event
    if (target.classList.contains("settings-icon")) {
        closeModal();
    };

    // Delete tag event
    if (target.classList.contains("close-tag")) {
        
        // Remove target tag from task, not from task array.
        const tagIndex = event.target.dataset.index;

        // console.log(tagIndex);
        // console.log(target);
        // console.log(currentTask);

        currentTask.removeTag(currentTask, tagIndex);

        populateForm(currentTask);

    };
        // Delete task event
        if (event.target.classList.contains("delete-btn")) {
            const type = 'Task';
                closeModal();
                openDelModal(taskId, type);
        };

});

// Form Events
dateInput.addEventListener('input', () => {
    // Event Delegation for date input/validity
    // Reset validity when date input is chosen - this removes the validity check entirely.
    dateInput.setCustomValidity('');
});
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm();
});

// ------ INITIALIZATION ------

// Build Projects list and populate tasks.
renderTags(tagsList.tagsArr);
renderProjects();
renderTask(currentProject);