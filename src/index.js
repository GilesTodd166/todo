import "./styles.css";
import { parse, parseISO, format } from "date-fns";

import { Project } from "./projects.js";
import { buildTask } from "./tasks.js";

console.log('index.js loaded');

// Projects.js Import
// Instance of a new Project
let firstProject = new Project("My First Project");

// Makes firstProject globally scoped.
window.firstProject = firstProject;

firstProject.addTask("Task One", "Description of the task saved", "03-05-2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
firstProject.addTask("Task Two", "Description of the task saved", "03-05-2026", "Medium", "SingleTag", ["A second comment", "Two comments"]);
firstProject.addTask("Task Three", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TwoTags",], "A single saved comment");

// Tasks.js Import
// Build Task using firstProject as arg - need to loop over stored projects to build more projects.
buildTask(firstProject);


// Form functions
const taskForm = document.getElementById('task-form');
const mainContent = document.querySelector('.main-content');
const dateInput = document.getElementById('task-date');

    // Reset validity when date input is chosen -- NEEDS WORK, MOVED INTO OPEN MODAL?
    dateInput.addEventListener('input', () => {
        dateInput.setCustomValidity('');
    });

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get task-id from attribute added when form loaded.
    const modalSaveBtn = document.querySelector('.modal-save-btn');
    let taskId = modalSaveBtn.getAttribute('task-id');
            
    const formData = new FormData(event.target);
        const taskName = formData.get('task-name');
        const taskDesc = formData.get('task-desc');
        const formDate = formData.get('task-date');
        const taskPriority = formData.get('task-priority');
        const taskTags = formData.get('task-tags');
        const taskComments = formData.get('task-comments');


            const dateObj = parseISO(formDate);
                let taskDate = format((dateObj), 'dd-MM-yyyy');
            
            const today = new Date();
            today.setHours(0,0,0,0);

            const dateInput = document.getElementById('task-date');
            
            dateInput.setCustomValidity('');

            if (dateObj < today) {
                dateInput.setCustomValidity('This date is in the past.');
            };

            if (!taskForm.checkValidity()) {
                taskForm.reportValidity();
                console.log('failed validity');
                return;
            };

            // STOP - Here we have a functioning validation - check above the form event listener
            //        to see an event listener purely on the date picker. 
            //        This doesn't feel fluid, I don't understand it fully.
            //        I think this needs to be a function so I can call it when editing tasks as well.

            //        Option to delete saved comments.
            //        Tags need work still, maybe create tags in the side bar, then let tasks
            //        select from existing tags. Could use delete functionality for comments to add/remove.


    // Add new task or update existing task using task ID.
    if (taskId == 'undefined') {
        firstProject.addTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments);
    } else {
        firstProject.editTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);
    };

    // Close modal window
    closeModal();

    // Clear task list and rebuild
    mainContent.innerHTML = '';
        buildTask(firstProject);
});


// Task Modal Const's
const main = document.querySelector('main');
const taskModal = document.querySelector('.task-modal');
const commentsModal = document.getElementById('modal-comments');

// Del Modal Const's
const delModalTask = document.querySelector('#taskName');
const delButton = document.querySelector('.delete-btn');

// Modal Functions and Events
function openTaskModal(taskId) {
    taskModal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Attach task-id to submit button on modal task form.
    const submitButton = document.querySelector('.modal-save-btn');
    submitButton.setAttribute('task-id', `${taskId}`);
};

function openDelModal(taskId) {
    deleteModal.style.display = 'block';
    document.body.classList.add('modal-open');

        delButton.dataset.taskId = `${taskId.id}`;

        delModalTask.innerHTML = `<h3>${taskId.title}</h3>`;
};

function closeModal() {
    taskModal.style.display = 'none';
    deleteModal.style.display = 'none';
    document.body.classList.remove('modal-open');
        taskForm.reset();
            commentsModal.innerHTML = '<label class="label-text" for="task-comments">Saved Comments:</label>';

        
};

// Populate form with unique task data for editing.
function populateForm(data) {
    document.getElementById('task-name').value = data.title;
    document.getElementById('task-desc').value = data.description;
    // Pull date string, convert it to formatted date with date-fns
        const dataDate = format(parse(data.date, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd');
    document.querySelector('input[type="date"]').value = dataDate;
    document.forms["task-form"].elements["task-priority"].value = data.priority;
    document.getElementById('task-tags').value = data.tags;

    // Pull forEach over data.comments and create a 'comment' in the DOM.
        let commentsArr = data.comments;
        // Flatten comments array to single array.
        const allStrings = commentsArr.flat(Infinity).filter(item => typeof item === 'string');

        let commentsModal = document.getElementById('modal-comments');

        allStrings.forEach((comment) => {
            let commentDiv = document.createElement('div');
                commentDiv.className = 'saved-comment';
                commentDiv.textContent = comment;
            commentsModal.appendChild(commentDiv);
                let modalLine = document.createElement('div');
                    modalLine.className = 'comments-line';
                        commentsModal.appendChild(modalLine);
        });
};


// Event delegation to ensure buttons remain active on innerHTML reset.
main.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-task-event')) {
        openTaskModal();
    };
});

main.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-event')) {
        // Find task data and pass it to openTaskModal() to populate taskModal form.

        let taskId = event.target.getAttribute('data-task-id');
        let projectLength = firstProject.tasks.length;

        openTaskModal(taskId);

            for (let i = 0; i < projectLength; i++) {
                if (taskId === firstProject.tasks[i].id) {
                        taskId = firstProject.tasks[i];
                };
            };

        populateForm(taskId);

            // Call deleteButton function
            addDeleteModal(taskId);
    };
});

// Function to link delete button on loaded task to delete modal, use taskId as arg.
function addDeleteModal(taskId) {
    taskModal.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            closeModal();
            openDelModal(taskId);
        };
    });
};

// Event to target each delete icon and open it by comparing dataset attr and task id.
main.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-event')) {

        let taskId = event.target.getAttribute('data-task-id');
        let projectLength = firstProject.tasks.length;

            for (let i = 0; i < projectLength; i++) {
                if (taskId === firstProject.tasks[i].id) {
                        taskId = firstProject.tasks[i];
                };
            };
        openDelModal(taskId);
    };
});

taskModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('settings-icon')) {
        closeModal();
    };
});

// // Delete Modal Const's
const deleteModal = document.querySelector('.delete-modal');
const saveButton = document.querySelector('.save-btn');

deleteModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('settings-icon')) {
        closeModal();
    };
});

deleteModal.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {

        let taskId = event.target.getAttribute('data-task-id');
        let projectLength = firstProject.tasks.length;

        for (let i = 0; i < projectLength; i++) {
            if (taskId === firstProject.tasks[i].id) {
                    taskId = firstProject.tasks[i];
            };
        };
        firstProject.removeTask(taskId.id);
            closeModal();
        mainContent.innerHTML = '';
            buildTask(firstProject);
    };
});

saveButton.addEventListener('click', () => {
    closeModal();
});