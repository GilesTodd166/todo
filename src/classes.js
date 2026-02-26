import { add } from "date-fns";

class Task {
    constructor(title, description, date, priority, tags, comments) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.tags = tags;
        this.comments = comments || [];
        this.id = crypto.randomUUID();
    };
}

class Project {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.tasks = [];
    }

        addOrEditTask(title, description, date, priority, tags, comments, id) {
        if (!id) {
            let newTask = new Task(title, description, date, priority, tags, comments, id);
                    
            // Commenting out as comments should already be an array, implement this
            // in index.js before passing in
            // const commentsArr = [];

            //     // If comments is empty, push empty array, not empty string to commentsArr.
            //     if (comments === '') {
            //         comments = [];
            //     } else {
            //         commentsArr.push(comments);
            //     }

            //     // commentsArr.push(comments);
            //     newTask.comments = commentsArr;

                this.tasks.push(newTask);
                    return;
        } else {
            // Pull tasks array, find array with id, update data.
            const targetId = id;
            const foundTask = this.tasks.find(item => item.id === targetId);
            console.log('edit task fired');

            // Commenting this out as comments should already be an array when passed
            // into editTask, apply this in index.js
            // const commentsArr = [];

            // // If comments is empty, push empty array, not empty string to commentsArr.
            // // Push existing comments and new comments to commentsArr.
            // if (comments === '') {
            //     comments = [];
            // } else {
            //     commentsArr.push(comments);
            // };

            if (foundTask) {
                foundTask.title = title;
                foundTask.description = description;
                foundTask.date = date;
                foundTask.priority = priority;
                foundTask.tags = tags;
                foundTask.comments = comments;
                // Editing this out as comments should already be an array
                // foundTask.comments = commentsArr;
            } else {
                console.log('Task not found');
            };
        };
    };

    // removeComment(targetTaskId, targetTaskComments, commentIndex) {
    //     console.log(targetTaskId, targetTaskComments, commentIndex);
    //     const foundTask = this.tasks.find(item => item.id === targetTaskId);

    //     let foundTaskComments = foundTask.comments

    //     foundTaskComments.splice(commentIndex, 1);

    //     console.log(foundTaskComments);

    //     return foundTaskComments;
    // }

    removeComment(currentTask, commentIndex) {
        let currentTaskComments = currentTask.comments
            currentTaskComments.splice(commentIndex, 1);

            // console.log(this.tasks);

        // const targetTask = this.tasks.find(task => task.id === taskId);

        // let targetTaskComments = targetTask.comments
        // targetTaskComments.splice(commentIndex, 1);
    }

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id != id);
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }
}

const allProjects = [];

function addProject(project) {
    console.log(project);
    allProjects.push(project);
};

function removeProject(projectId) {
    const projectToRemove = allProjects.findIndex(project => project.id === projectId);

    if (projectToRemove !== -1) {
        allProjects.splice(projectToRemove, 1);
    };
};

function getProjectById(projects, id) {
    // this might need work as it may return null based on argument input.
    return projects.find(project => project.id === id) || null;
};

// Instance of a new Project
let firstProject = new Project("My First Project");
let secondProject = new Project("My Second Project");
addProject(firstProject);
addProject(secondProject);

// Makes firstProject globally scoped.
window.firstProject = firstProject;
window.secondProject = secondProject;

firstProject.addOrEditTask("Task One", "Description of the task saved", "03-05-2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
firstProject.addOrEditTask("Task Two", "Description of the task saved", "03-05-2026", "Medium", "SingleTag", ["A second comment", "Two comments"]);
firstProject.addOrEditTask("Task Three", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TwoTags",], "A single saved comment");

secondProject.addOrEditTask("2nd Project Task One", "Description of the task saved", "03-05-2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
secondProject.addOrEditTask("2nd Project Task Two", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TwoTags",], "A single saved comment");

export { Project, allProjects, addProject, removeProject, getProjectById };