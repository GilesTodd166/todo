import "./styles.css";
import { format } from "date-fns";

import { Project } from "./projects.js";
import { buildTask } from "./tasks.js";

console.log('index.js loaded');

// Projects.js Import
// Instance of a new Project
let firstProject = new Project("My First Project");

// Makes firstProject globally scoped.
window.firstProject = firstProject;

firstProject.addTask("Task One", "Description of the task saved", "03/05/2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
firstProject.addTask("Task Two", "Description of the task saved", "03/05/2026", "Low", "SingleTag", ["A second comment", "Two comments"]);
firstProject.addTask("Task Two", "Description of the task saved", "03/05/2026", "Low", "SingleTag", "A single saved comment");

// Tasks.js Import
// Build Task using firstProject as arg - need to loop over stored projects to build more projects.
buildTask(firstProject);


// Form functions
const taskForm = document.getElementById('task-form');
const mainContent = document.querySelector('.main-content');

taskForm.addEventListener('submit', function(e) {
    e.preventDefault;

    const formData = new FormData(e.target);
        const taskName = formData.get('task-name');
        const taskDesc = formData.get('task-desc');
        const taskDate = formData.get('task-date');
        const taskPriority = formData.get('task-priority');
        const taskTags = formData.get('task-tags');
        const taskComments = formData.get('task-comments');
    
            firstProject.addTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments);

    // Close modal window
    closeModal();
    
    // May need to clear form inputs at this stage, depends on how accessing and 
    // editing existing tasks works.

    // Clear task list and rebuild
    mainContent.innerHTML = '';
        buildTask(firstProject);
});


// Task Modal Const's
const main = document.querySelector('main');
const taskModal = document.querySelector('.task-modal');

// Modal Functions and Events
function openTaskModal() {
    taskModal.style.display = 'block';
    document.body.classList.add('modal-open');
};

function openDelModal(event) {
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');
};

function closeModal() {
    taskModal.style.display = 'none';
    deleteModal.style.display = 'none';
    document.body.classList.remove('modal-open');
};

// Event delegation to ensure buttons remain active on innerHTML reset.
main.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-task-event')) {
        openTaskModal();
    };
});

main.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-event')) {
        openDelModal();
    };
});

taskModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('settings-icon')) {
        closeModal();
    };
});

// // Delete Modal Const's
const deleteModal = document.querySelector('.delete-modal');
const delButton = document.querySelector('.delete-btn');
const saveButton = document.querySelector('.save-btn');

deleteModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('settings-icon')) {
        closeModal();
    };
});

// firstProject.tasks.forEach((task) => {

    delButton.addEventListener('click', () => {

        let taskId = firstProject.tasks[0].id
        
        firstProject.removeTask(taskId);
            closeModal();
            mainContent.innerHTML = '';
                buildTask(firstProject);
    });

    saveButton.addEventListener('click', () => {
        closeModal();
    });

// });