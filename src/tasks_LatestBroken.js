import blackCircle from "./media/icons/add_circle_black.svg";

function buildTask(project) {

    if (!project) return;

    const mainContent = document.querySelector('.main-content');
        if (!project || !mainContent) return;

        mainContent.innerHTML = '';

    //Update Headers
    const parentHeader = document.getElementById('parent-header');
        parentHeader.innerHTML = `${project.title}`;

    // Idea to display child project header, didn't complete testing, header loaded before javascript.
    // if (project.section) {
    // const childHeader = document.getElementById('child-header');
    //     childHeader.style.display = block;
    //     childHeader.innerHTML = `${project.section}`;
    // };

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

    // WORK THIS IN AS ADDITION LATER - EACH PROJECT NEEDS SECTIONS
    // const sectionHeader = document.createElement('h3');
    //     sectionHeader.textContent = `${project.tasks.section}`;
    //         section.append(sectionHeader);

    // Loop over each task and display results.
    project.tasks.forEach((item) => {

        const task = document.createElement('div');
            task.setAttribute('class', 'task');
                section.append(task);

        const taskTitle = document.createElement('div');
            taskTitle.setAttribute('class', 'task-title');
            taskTitle.innerText = `${item.title}`;
                task.append(taskTitle);

        const taskDesc = document.createElement('div');
            taskDesc.setAttribute('class', 'task-desc');
            taskDesc.innerText = `${item.description}`;
                task.append(taskDesc);

        const taskInfo = document.createElement('div');
            taskInfo.setAttribute('class', 'task-info');
                task.append(taskInfo);

        const taskDate = document.createElement('div');
            taskDate.setAttribute('class', 'task-date');
            taskDate.innerText = `${item.date}`;
                taskInfo.append(taskDate);

        const taskPriority = document.createElement('div');
            taskPriority.innerText = `${item.priority}`;
            // Set task priority as class
            taskPriority.setAttribute('class', `${item.priority}`);
            taskPriority.setAttribute('id', 'task-priority');
                taskInfo.append(taskPriority);

        // Check for single/mult tags and push to array.
        const taskTags = document.createElement('div');
            taskTags.setAttribute('class', 'task-tags');

            let tagsLength = item.tags.length;
            let tagsArr = item.tags;
            let taskHolder = [];

            if (typeof tagsArr === 'string') {
                taskHolder.push(`#${item.tags}`);
            } else {
                for (let t = 0; t < tagsLength; t++) {
                    taskHolder.push(`#${item.tags[t]}`);
                };
            };
            taskTags.innerText = taskHolder.join(" ");
            taskInfo.append(taskTags);

        // Calculate total comments 
        
        // Count array elements/nested array elements
        function countComments(arr) {
            let count = 0;
                for (const element of arr) {
                    if (Array.isArray(element)) {
                        count += countComments(element);
                    } else {
                        count++;
                    }
                }
                return count;
            };

        let commentsArr = item.comments;

        const taskComments = document.createElement('div');
            taskComments.setAttribute('class', 'task-comments');
            taskComments.innerText = `${countComments(commentsArr)}`;
                taskInfo.append(taskComments);
        const commentImg = document.createElement('div');
            commentImg.setAttribute('class', 'task-icon comments-event');
                taskComments.append(commentImg);

        
        const editDelete = document.createElement('div');
            editDelete.setAttribute('class', 'task-edit-del');
                taskInfo.append(editDelete);
                
        const editImg = document.createElement('div');
            editImg.setAttribute('class', 'task-icon edit-event');
            // Store task ID as dataset attr.
            editImg.dataset.taskId = `${item.id}`;

        const delImg = document.createElement('div');
            delImg.setAttribute('class', 'task-icon delete-event');
                // Store task ID as dataset attr.
                delImg.dataset.taskId = `${item.id}`;
                editDelete.append(editImg, delImg);

    });
};

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
    
        const endLine = document.createElement('div');
        endLine.setAttribute('class', 'end-line');
            mainContent.append(endLine);
 
export { buildTask };