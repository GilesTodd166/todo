import blackCircle from "./media/icons/add_circle_black.svg";
import blackComment from "./media/icons/comment_black.svg";
import greyEdit from "./media/icons/edit_grey.svg";
import greyDel from "./media/icons/delete_grey.svg";

function buildTask(project) {

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
    const mainContent = document.querySelector('.main-content');
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

        const taskTags = document.createElement('div');
            taskTags.setAttribute('class', 'task-tags');
            taskTags.innerText = `#${item.tags}`;
                taskInfo.append(taskTags);

        // Calculate total comments 
        const commentsArr = item.comments;

            // Working on conditional to check if only one comment was saved as array[0].length counts string length if only one value, counts total number of entires otherwise.
            // Conditional to check if only one comment as it's stored as a string.
            // let totalComments = 0;
            //     if (typeof commentsArr[0] === 'string') {

            //         totalComments = 1;

            //     } else {

            //         console.log(totalComments);
                    
            //         totalComments = commentsArr[0].length;
            //     }

                let totalComments = commentsArr[0].length;

        const taskComments = document.createElement('div');
            taskComments.setAttribute('class', 'task-comments');
            taskComments.innerText = `${totalComments}`;
                taskInfo.append(taskComments);
        const commentImg = document.createElement('img');
            commentImg.src = blackComment;
            commentImg.setAttribute('class', 'task-icon');
                taskComments.append(commentImg);

        
        const editDelete = document.createElement('div');
            editDelete.setAttribute('class', 'task-edit-del');
                taskInfo.append(editDelete);
        const editImg = document.createElement('img');
            editImg.setAttribute('class', 'task-icon');
            editImg.src = greyEdit;
        const delImg = document.createElement('img');
            delImg.setAttribute('class', 'task-icon delete-event');
            delImg.setAttribute('id', 'delete-icon');
            delImg.src = greyDel;
                editDelete.append(editImg, delImg);

    });

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

    // Delete Modal Const's
    // const deleteModal = document.querySelector('.delete-modal');
    // const delButton = document.querySelector('.delete-btn');
    // const saveButton = document.querySelector('.save-btn');

    // 

        // delButton.addEventListener('click', () => {
        //     let taskId = firstProject.tasks[0].id
        //     console.log(taskId);
        //     firstProject.removeTask(taskId);
        //         closeModal();
        //         mainContent.innerHTML = '';
        //             buildTask(firstProject);
        // });

        // saveButton.addEventListener('click', () => {
        //     closeModal();
        // });

    // });

};

function deleteTask(task) {

}

    
export { buildTask };