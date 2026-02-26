// function buildTask(project) {

//     if (!project) return;

//     const mainContent = document.querySelector('.main-content');

//     // Commenting this out for now, i believe a renderTask(taskId) is necessary in index.js
//     // This is where mainContent should be cleared.
//     // Pass a task object in ie mainContent and build the
//     //     mainContent.innerHTML = '';

//     //Update Headers
//     const parentHeader = document.getElementById('parent-header');
//         parentHeader.innerHTML = `${project.title}`;

//     // Create Project header, main-line and section.
//     const projectHeader = document.createElement('h1');
//         projectHeader.textContent = `${project.title}`;
//             mainContent.append(projectHeader);

//     const mainLine = document.createElement('div');
//         mainLine.setAttribute('class', 'main-line');
//             mainContent.append(mainLine);

//     const section = document.createElement('div');
//         section.setAttribute('class', 'section');
//             mainContent.append(section);

//     // Loop over each task and display results.
//     project.tasks.forEach((task) => {

//         buildTaskElement(task, section);

//     });

//     // Add Task Button
//     const mainTaskBtn = document.createElement('div');
//         mainTaskBtn.setAttribute('id', 'mainTaskBtn');
//         mainTaskBtn.setAttribute('class', 'add-task');
//         mainTaskBtn.innerHTML = '<span class="add-task-event">Add Task</span>';
//             mainContent.append(mainTaskBtn);
//     const taskImg = document.createElement('img');
//         taskImg.src = blackCircle;
//         taskImg.setAttribute('class', 'task-icon add-task-event');
//             mainTaskBtn.append(taskImg);
// };

function buildTaskElement(task) {

        const taskDiv = document.createElement('div');
            taskDiv.setAttribute('class', 'task');
            // endLine.append(taskDiv);

        const taskTitle = document.createElement('div');
            taskTitle.setAttribute('class', 'task-title');
            taskTitle.innerText = `${task.title}`;
                taskDiv.append(taskTitle);

        const taskDesc = document.createElement('div');
            taskDesc.setAttribute('class', 'task-desc');
            taskDesc.innerText = `${task.description}`;
                taskDiv.append(taskDesc);

        const taskInfo = document.createElement('div');
            taskInfo.setAttribute('class', 'task-info');
                taskDiv.append(taskInfo);

        const taskDate = document.createElement('div');
            taskDate.setAttribute('class', 'task-date');
            taskDate.innerText = `${task.date}`;
                taskInfo.append(taskDate);

        const taskPriority = document.createElement('div');
            taskPriority.innerText = `${task.priority}`;
            // Set task priority as class
            taskPriority.setAttribute('class', `${task.priority}`);
            taskPriority.setAttribute('id', 'task-priority');
                taskInfo.append(taskPriority);

        // Check for single/mult tags and push to array.
        let formattedTags = formatTags(task.tags);
        const taskTags = document.createElement('div');
            taskTags.className = 'task-tags';
            taskTags.innerText = formattedTags;
                taskInfo.append(taskTags);

        // Calculate total comments 
        let totalComments = countComments(task.comments);
        const taskComments = document.createElement('div');
            taskComments.className = 'task-comments';
            taskComments.innerText = totalComments;
                taskInfo.append(taskComments);
            // Add comments image
            const commentImg = document.createElement('div');
            commentImg.setAttribute('class', 'task-icon comments-event');
                taskComments.append(commentImg);

        // Create edit and delete icons       
        const editImg = createIcon('task-icon edit-event', task.id);
        const delImg = createIcon('task-icon delete-event', task.id);

        const editDelete = document.createElement('div');
            editDelete.className = 'task-edit-del';
            editDelete.append(editImg, delImg);
            taskInfo.append(editDelete);

            return taskDiv;
};

function formatTags(tags) {
    // If tags is empty, return blank string without #.
    if (!tags) return '';
    // Pass tags to check if its a single string, append an # in return.
    if (typeof tags === 'string') {
        return `#${tags}`;
    // If tags are multiples stored in an array, map goes over each one, appends # then
    // join makes an empty space between each one.
    } else if (Array.isArray(tags)) {
        return tags.map(tag => `#${tag}`).join(" ");
    }
};


// Count array elements/nested array elements
function countComments(comments) {
    return Array.isArray(comments) ? comments.length : 0;
};

function createIcon(className, datasetId) {
    const iconDiv = document.createElement('div');
        iconDiv.className = className;
            if (datasetId) {
                iconDiv.dataset.taskId = datasetId;
            };
        return iconDiv;
};
 
export { buildTaskElement };