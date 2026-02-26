import "./styles.css";
import { parse, parseISO, format } from "date-fns";
import blackCircle from "./media/icons/add_circle_black.svg";

import { Project, allProjects, addProject, removeProject, getProjectById } from "./classes.js";
import { buildTaskElement } from "./tasks.js";
import { buildProjectElement } from "./projects.js";

let currentProject = allProjects[0];
window.currentProject = currentProject;


// ------ CONSTS -------

// Consts for populating mainContent and sideProjects.
const mainContent = document.querySelector('.main-content');
const sideProjects = document.querySelector('.side-projects');

// Consts for Modals
const deleteModal = document.querySelector('.delete-modal');
const delButton = document.querySelector('.delete-btn');
const delModalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('.modal-content');
const parentHeader = document.getElementById('parent-header');

// ------ FUNCTIONS ------

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
    sideProjects.innerHTML = '';

    allProjects.forEach((project, index) => {
        const projectElement = buildProjectElement(project, index);
            sideProjects.append(projectElement);
    });
};

function openDelModal(index, taskOrProject) {
    // This could be a wider function to cover all modals, see in future.
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');

    if (taskOrProject === 'project') {
        delButton.dataset.index = index;
        delModalTitle.innerHTML = `<h3>${allProjects[index].title}</h3>`;
    } else {
        // logic for when its a task not a project
    }
};

function closeDelModal() {
    deleteModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    // Commented as I havent gotten to form or comments yet, unsure if this applies to close modal
    // Could be if statements to close all modals here.
    // taskForm.reset();
    //     commentsModal.innerHTML = '<label class="label-text" for="task-comments">Saved Comments:</label>';
};

// ------ EVENTS ------

// Event Delegation for sideProjects.
sideProjects.addEventListener('click', (event) => {
    const target = event.target;
        if (!target.dataset.index) return;

        const index = Number(target.dataset.index);

        // Target the project name div
        if (target.classList.contains("project-name")) {
            renderTask(allProjects[index]);
        };
        // Target the close icon
        if (target.classList.contains("close-icon")) {
            const projectDetector = 'project';
                openDelModal(index, projectDetector);
        };
});

// Event Delegation for modalContent
modalContent.addEventListener('click', (event) => {
    const target = event.target;
    // Close icon function
    if (target.classList.contains("settings-icon")) {
        closeDelModal();
    };
    // Delete button function
    if (target.classList.contains("delete-btn")) {
        const targetProjectIndex = target.dataset.index;
        console.log(targetProjectIndex);
            removeProject(targetProjectIndex);
                // Re render projects and tasks with new currentProject.
                currentProject = allProjects[0];
                    renderProjects();
                    renderTask(currentProject);
                        closeDelModal();

                        // STOP -- As per chatGPT, using the id to find the project, using my
                        // getProjectId helper is more effective. It will help later if projects
                        // are reordered. Consider this for tasks as tasks will likely be reordered.
    };
});

// ------ INITIALIZATION ------

// Build Projects list and populate tasks.
renderProjects();
renderTask(currentProject);

// let sideProjects;
// let mainContent;

// // Set state for currentProject;
// let currentProject = null;

// // Helper function to select project and render tasks

// function selectProject(projectIndex = 0) {
//     if (allProjects.length === 0) return;  // no projects to select
//     currentProject = allProjects[projectIndex];
//     buildTask(currentProject);
// }

// // Wait until DOM is ready
// document.addEventListener('DOMContentLoaded', () => {
//     sideProjects = document.querySelector('.side-projects');
//     mainContent = document.querySelector('.main-content');

//     // Ensure at least one project exists
//     if (allProjects.length === 0) addProject("New Project");
//     currentProject = allProjects[0];

//     // Build sidebar and tasks
//     buildProjects();
//     buildTask(currentProject);

//     // Sidebar click delegation (once)
//     sideProjects.addEventListener('click', (e) => {
//         const target = e.target;
//         if (!target.dataset.index) return;

//         const index = Number(target.dataset.index);

//         if (target.classList.contains('project-name')) {
//             currentProject = allProjects[index];
//             buildTask(currentProject);
//         }

//         if (target.classList.contains('close-icon')) {
//             removeProject(index);
//             buildProjects();
//             if (allProjects.length) {
//                 currentProject = allProjects[0];
//                 buildTask(currentProject);
//             } else {
//                 mainContent.innerHTML = '';
//             }
//         }
//     });
// });

// // Sidebar Consts
// // const sideProjects = document.querySelector('.side-projects');
// const projectHeader = document.querySelector('.project-header');
// // const mainContent = document.querySelector('.main-content');

// function buildProjects() {
//     sideProjects.innerHTML = '<h3>Projects</h3>'; // reset

//     allProjects.forEach((project, index) => {
//         const projectDiv = document.createElement('div');
//             projectDiv.classList = 'project-div';
//             projectDiv.setAttribute('data-index', index);
//                 sideProjects.append(projectDiv);

//         const projectLi = document.createElement('li');
//             projectLi.textContent = project.title;
//             projectLi.classList = 'project-name';
//             projectLi.setAttribute('data-index', index);
//                 projectDiv.appendChild(projectLi);

//         const closeProject = document.createElement('div');
//             closeProject.className = 'close-icon';
//             closeProject.setAttribute('data-index', index);
//                 projectDiv.appendChild(closeProject);
//     });
// };


// // STOP -- I broke it. Here are chatGPT's bullet points, first two are most important
// // buildTask is being called when its required DOM or project doesn’t exist
// // On initial load and after deletions, buildTask assumes a task container and a 
// // selected project are present, but they aren’t yet — so querySelector(...) returns null and 
// // .innerHTML crashes.

// // currentProject is read too early and can be undefined
// // You set currentProject = allProjects[0] at module load time, before projects are guaranteed to exist,
// //  then pass undefined into buildTask, so nothing can render.

// // Event listeners are being re-attached every time buildProjects() runs
// // Sidebar click handlers live inside buildProjects, so rebuilding the sidebar stacks multiple listeners,
// //  causing duplicate renders, unexpected clears, and “tasks not building” behaviour.


// // Form Consts
// const taskForm = document.getElementById('task-form');
// const projectForm = document.getElementById('project-form');
// const dateInput = document.getElementById('task-date');

// // Form Functions
// function checkValidity(dateObj) {

//     // Reset validity when date input is chosen - this removes the validity check entirely.
//     dateInput.addEventListener('input', () => {
//         dateInput.setCustomValidity('');
//     });
    
//         const today = new Date();
//         // Sets clock to 00:00, aligns date to midnight to ensure its correct, otherwise
//         // choosing todays date would count as in the past.
//         today.setHours(0,0,0,0);

//         // Reapplies the custom validity check.
//         dateInput.setCustomValidity('');

//         if (dateObj < today) {
//             dateInput.setCustomValidity('This date is in the past.');
//         };

//         if (!taskForm.checkValidity()) {
//             taskForm.reportValidity();
//             console.log('failed validity');
//             return false;
//         };
//         return true;
// };

// function addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId) {
//     // Add new task or update existing task using task ID.
//     if (taskId == 'undefined') {
//         currentProject.addTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments);
//     } else {
//         currentProject.editTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);
//     };
// }
    
// function submitForm() {
//     // // Get task-id from attribute added when form loaded.
//     const modalSaveBtn = document.querySelector('.modal-save-btn');
//     let taskId = modalSaveBtn.getAttribute('task-id');

//     let existingComments = document.querySelectorAll('.saved-comment');
//     // Convert nodelist of comments to array of textContent, removing whitespaces either end.
//     let existingCommentsArray = Array.from(existingComments, item => item.textContent.trim());
            
//     const formData = new FormData(event.target);
//         const taskName = formData.get('task-name');
//         const taskDesc = formData.get('task-desc');
//         const formDate = formData.get('task-date');
//         const taskPriority = formData.get('task-priority');
//         const taskTags = formData.get('task-tags');
//         // Pull new comments
//         const newComments = formData.get('task-comments');
//         // Push new comments to existing comments
//         if (newComments === '') {
//         } else {
//             existingCommentsArray.push(newComments);
//         } 
//         // Update taskComments to use as arg for addOrEditTask
//         const taskComments = existingCommentsArray;

//             const dateObj = parseISO(formDate);

//                 // checkValidity() returns a true or false depending on validity check
//                 // if it returns false, this return statement stops the submit event.
//                 if (!checkValidity(dateObj)) return;

//             let taskDate = format((dateObj), 'dd-MM-yyyy');

//     // Add or Edit task based formData and taskId
//     addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);

//     // Close modal window
//     closeModal();

//     // Clear task list and rebuild task from project
//     // mainContent.innerHTML = '';
//         buildTask(currentProject);
// };

// function submitProjectForm() {
//     const projectSaveBtn = document.querySelector('.project-save-btn');

//     const projectFormData = new FormData(event.target);

//     const projectTitle = projectFormData.get('project-name');

//     addProject(projectTitle);

//         // sideProjects.innerHTML = '<h3>Projects</h3><ul>'

//     buildProjects();

//     // STOP - When a new project is created as the first project, ie no other projects present
//     // Need to rebuild the project in the view port, see currentProject...
//     currentProject = allProjects[0];

//     console.log(currentProject);
//     buildTask(currentProject);

//     closeProjectModal();
// };

// // Form Events
// taskForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     submitForm();
// });
// projectForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     submitProjectForm();
// });

// // Task Modal Const's
// const main = document.querySelector('main');
// const taskModal = document.querySelector('.task-modal');
// const projectModal = document.querySelector('.project-modal');
// const commentsModal = document.getElementById('modal-comments');

// // Del Modal Const's
// const delModalTask = document.querySelector('#taskName');
// const delButton = document.querySelector('.delete-btn');

// // Modal Functions and Events
// function openTaskModal(taskId) {
//     taskModal.style.display = 'block';
//     document.body.classList.add('modal-open');

//     // Attach task-id to submit button on modal task form.
//     let submitButton = document.querySelector('.modal-save-btn');
//     submitButton.setAttribute('task-id', `${taskId}`);
// };

// function openProjectModal() {
//     projectModal.style.display = 'block';
//     document.body.classList.add('modal-open');

//     let submitButton = document.querySelector('.modal-save-btn');
// };

// function openDelModal(taskId) {
//     deleteModal.style.display = 'block';
//     document.body.classList.add('modal-open');

//         delButton.dataset.taskId = `${taskId.id}`;

//         delModalTask.innerHTML = `<h3>${taskId.title}</h3>`;
// };

// function closeModal() {
//     taskModal.style.display = 'none';
//     deleteModal.style.display = 'none';
//     document.body.classList.remove('modal-open');
//         taskForm.reset();
//             commentsModal.innerHTML = '<label class="label-text" for="task-comments">Saved Comments:</label>';
// };
// function closeProjectModal() {
//     projectModal.style.display = 'none';
//     deleteModal.style.display = 'none';
//     document.body.classList.remove('modal-open');
// };

// // Populate form with unique task data for editing.
// function populateForm(data) {
//     document.getElementById('task-name').value = data.title;
//     document.getElementById('task-desc').value = data.description;
//     // Pull date string, convert it to formatted date with date-fns
//         const dataDate = format(parse(data.date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
//     document.querySelector('input[type="date"]').value = dataDate;
//     document.forms["task-form"].elements["task-priority"].value = data.priority;
//     document.getElementById('task-tags').value = data.tags;

//     populateComments(data);
// };

// function populateComments(data) {

//     // Pull forEach over data.comments and create a 'comment' in the DOM.
//     let commentsArr = data.comments;
//     // Flatten comments array to single array.
//     const allStrings = Array.isArray(commentsArr)
//         ? commentsArr.flat(Infinity).filter(i => typeof i === 'string')
//         : [];

//     let commentsModal = document.getElementById('modal-comments');

//     allStrings.forEach((comment, index) => {
//         let commentsContainer = document.createElement('div');
//             commentsContainer.className = 'comments-container';
//                 commentsContainer.setAttribute('data-index', index);
//                     commentsModal.appendChild(commentsContainer);
//         let commentDiv = document.createElement('div');
//             commentDiv.className = 'saved-comment';
//             commentDiv.textContent = comment;
//                 commentDiv.setAttribute('data-index', index);
//                     commentsContainer.appendChild(commentDiv);
//         let closeIcon = document.createElement('div');
//             closeIcon.className = 'close-icon';
//             closeIcon.setAttribute('id', 'close-icon');
//                 closeIcon.setAttribute('data-index', index);
//                     commentsContainer.appendChild(closeIcon);
//         let modalLine = document.createElement('div');
//             modalLine.className = 'comments-line';
//                 commentsModal.appendChild(modalLine);

//         // Click event targets index saved as dataset, passes index to removeComment
//         closeIcon.addEventListener('click', (event) => {
//             const targetComment = event.target.dataset.index;
//             removeComment(targetComment);
//         });
//     });

//     // Splice removes 1 element at target index, remove function removes all instances of data-index.
//     function removeComment(target) {
//         allStrings.splice(target, 1);
        
//             const commentToRemove = document.querySelector(`[data-index="${target}"]`);
//                 if (commentToRemove) commentToRemove.remove();

//         populateComments(allStrings);
//     };

// };

// // Event delegation to ensure buttons remain active on innerHTML reset.
// main.addEventListener('click', (event) => {
//     const target = event.target;

//     if (event.target.classList.contains('add-task-event')) {
//         openTaskModal();
//         return;
//     };

//     if (event.target.classList.contains('add-project-event')) {
//         openProjectModal();
//         return;
//     };

//     if (event.target.classList.contains('edit-event')) {
//         // Find task data and pass it to openTaskModal() to populate taskModal form.
//         let taskId = event.target.getAttribute('data-task-id');
//         let projectLength = currentProject.tasks.length;

//         openTaskModal(taskId);

//             for (let i = 0; i < projectLength; i++) {
//                 if (taskId === currentProject.tasks[i].id) {
//                         taskId = currentProject.tasks[i];
//                 };
//             };

//         populateForm(taskId);

//             // Call deleteButton function
//             addDeleteModal(taskId);
//     };
    
//     // Event to target each delete icon and open it by comparing dataset attr and task id.
//     if (event.target.classList.contains('delete-event')) {

//         let taskId = event.target.getAttribute('data-task-id');
//         let projectLength = currentProject.tasks.length;

//             for (let i = 0; i < projectLength; i++) {
//                 if (taskId === currentProject.tasks[i].id) {
//                         taskId = currentProject.tasks[i];
//                 };
//             };
//         openDelModal(taskId);
//     };

// });


// // Function to link delete button on loaded task to delete modal, use taskId as arg.
// function addDeleteModal(taskId) {
//     taskModal.addEventListener('click', (event) => {
//         if (event.target.classList.contains('delete-btn')) {
//             closeModal();
//             openDelModal(taskId);
//         };
//     });
// };

// taskModal.addEventListener('click', (event) => {
//     if (event.target.classList.contains('settings-icon')) {
//         closeModal();
//     };
// });
// projectModal.addEventListener('click', (event) => {
//     if (event.target.classList.contains('settings-icon')) {
//         closeProjectModal();
//     };
// });

// // // Delete Modal Const's
// const deleteModal = document.querySelector('.delete-modal');
// const saveButton = document.querySelector('.save-btn');

// deleteModal.addEventListener('click', (event) => {
//     if (event.target.classList.contains('settings-icon')) {
//         closeModal();
//     };
// });

// deleteModal.addEventListener('click', (event) => {
//     if (event.target.classList.contains('delete-btn')) {

//         let taskId = event.target.getAttribute('data-task-id');
//         let projectLength = currentProject.tasks.length;

//         for (let i = 0; i < projectLength; i++) {
//             if (taskId === currentProject.tasks[i].id) {
//                     taskId = currentProject.tasks[i];
//             };
//         };
//         currentProject.removeTask(taskId.id);
//             closeModal();
//         // mainContent.innerHTML = '';
//             buildTask(currentProject);
//     };
// });

// saveButton.addEventListener('click', () => {
//     closeModal();
// });