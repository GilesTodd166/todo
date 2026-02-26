import "./styles.css";
import { parse, parseISO, format } from "date-fns";

import { Project, allProjects } from "./projects.js";
import { buildTask } from "./tasks.js";

// Functionality to create new Projects
// Can create a second Project which saves to its own secondProject object.
// To update: adding task, openModal, deleteModal
//
// Start with dynamically update projects with existing project links.
// Click to buildTask with clicked project.


// Sidebar Consts
const sideProjects = document.querySelector('.side-projects');
let currentProject = allProjects[0];
    // Create header forEach project title
    allProjects.forEach((project) => {
        const projectLi = document.createElement('li');
        projectLi.textContent = (`${project.title}`);
            sideProjects.appendChild(projectLi);

            // STOP -- Assuming I need to add listener to allow clicking each project
            //         to run buildProject(project);
            //         good luck, hope the party was fun!
    });

    // Event delegation for projects
    sideProjects.addEventListener('click', (event) => {
        let clickedProject = event.target.textContent;

        let foundProject = allProjects.find(project => project.title === clickedProject);

        mainContent.innerHTML = '';

        buildTask(foundProject);

        currentProject = foundProject;
    });


// Tasks.js Import
// Build Task using firstProject as arg.
buildTask(allProjects[0]);

// Form Consts
const taskForm = document.getElementById('task-form');
const mainContent = document.querySelector('.main-content');
const dateInput = document.getElementById('task-date');

// Form Functions
function checkValidity(dateObj) {

    // Reset validity when date input is chosen - this removes the validity check entirely.
    dateInput.addEventListener('input', () => {
        dateInput.setCustomValidity('');
    });
    
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
    if (taskId == 'undefined') {
        firstProject.addTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments);
    } else {
        firstProject.editTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);
    };
}
    
function submitForm() {
    // // Get task-id from attribute added when form loaded.
    const modalSaveBtn = document.querySelector('.modal-save-btn');
    let taskId = modalSaveBtn.getAttribute('task-id');

    let existingComments = document.querySelectorAll('.saved-comment');
    // Convert nodelist of comments to arrat of textContent, removing whitespaces either end.
    let existingCommentsArray = Array.from(existingComments, item => item.textContent.trim());
            
    const formData = new FormData(event.target);
        const taskName = formData.get('task-name');
        const taskDesc = formData.get('task-desc');
        const formDate = formData.get('task-date');
        const taskPriority = formData.get('task-priority');
        const taskTags = formData.get('task-tags');
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

    // Add or Edit task based formData and taskId
    addOrEditTask(taskName, taskDesc, taskDate, taskPriority, taskTags, taskComments, taskId);

    // Close modal window
    closeModal();

    // Clear task list and rebuild task from project
    mainContent.innerHTML = '';
        buildTask(firstProject);
};

// Form Events
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm();
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

    populateComments(data);
};

function populateComments(data) {

    // Pull forEach over data.comments and create a 'comment' in the DOM.
    let commentsArr = data.comments;
    // Flatten comments array to single array.
    const allStrings = Array.isArray(commentsArr)
        ? commentsArr.flat(Infinity).filter(i => typeof i === 'string')
        : [];

    let commentsModal = document.getElementById('modal-comments');

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
                    commentsContainer.appendChild(closeIcon);
        let modalLine = document.createElement('div');
            modalLine.className = 'comments-line';
                commentsModal.appendChild(modalLine);

        // Click event targets index saved as dataset, passes index to removeComment
        closeIcon.addEventListener('click', (event) => {
            const targetComment = event.target.dataset.index;
            removeComment(targetComment);
        });
    });

    // Splice removes 1 element at target index, remove function removes all instances of data-index.
    function removeComment(target) {
        allStrings.splice(target, 1);
        
            const commentToRemove = document.querySelector(`[data-index="${target}"]`);
                if (commentToRemove) commentToRemove.remove();

        populateComments(allStrings);
    };

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