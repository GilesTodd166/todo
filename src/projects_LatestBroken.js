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

    addTask(title, description, date, priority, tags, comments, id) {
        let newTask = new Task(title, description, date, priority, tags, comments, id);
        
            const commentsArr = [];

                // If comments is empty, push empty array, not empty string to commentsArr.
                if (comments === '') {
                    comments = [];
                } else {
                    commentsArr.push(comments);
                }

                // commentsArr.push(comments);
                newTask.comments = commentsArr;

        this.tasks.push(newTask);

        // NOTE - Maybe JSON.parse for pulling existing array and updating - research needed.
        //        I believe we'll need an editTask function here to pull and push additional
        //        task data.

        // this.pushTask(new Task(title, description, date, priority, tags, comments, id));

    }

    // This is currently not being used, might be used when editTask is implemented.
    pushTask(task) {
        this.tasks.push(task);
    }

    editTask(title, description, date, priority, tags, comments, id) {
        // Pull tasks array, find array with id, update data.
        const targetId = id;
        const foundTask = this.tasks.find(item => item.id === targetId);
        console.log('edit task fired');
        const commentsArr = [];

        // If comments is empty, push empty array, not empty string to commentsArr.
        // Push existing comments and new comments to commentsArr.
        if (comments === '') {
            comments = [];
        } else {
            commentsArr.push(comments);
        };

        if (foundTask) {
            foundTask.title = title;
            foundTask.description = description;
            foundTask.date = date;
            foundTask.priority = priority;
            foundTask.tags = tags;
            foundTask.comments = commentsArr;
        } else {
            console.log('Task not found');
    };
};

    removeTask(id) {
        this.id = id;
        this.tasks = this.tasks.filter(task => task.id != id);
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }
}

// Projects.js Import
// Instance of a new Project
let firstProject = new Project("My First Project");
let secondProject = new Project("My Second Project");

// Makes firstProject globally scoped.
window.firstProject = firstProject;
window.secondProject = secondProject;

firstProject.addTask("Task One", "Description of the task saved", "03-05-2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
firstProject.addTask("Task Two", "Description of the task saved", "03-05-2026", "Medium", "SingleTag", ["A second comment", "Two comments"]);
firstProject.addTask("Task Three", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TwoTags",], "A single saved comment");

secondProject.addTask("2nd Project Task One", "Description of the task saved", "03-05-2026", "High", "SingleTag", ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
secondProject.addTask("2nd Project Task Two", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TwoTags",], "A single saved comment");

const allProjects = [];
let currentProjectId = null;
let updatedProjects;

function addProject(title) {
    // Check if new project is just a title
    if (typeof title === 'string') {
        // Create new Project out of title
        let newProjectArr = new Project;
            newProjectArr.title = title;
                // Push new project with title arg as title
                allProjects.push(newProjectArr);
    } else {
        allProjects.push(title);
    };
};

function removeProject(targetProject) {

    allProjects.splice(targetProject, 1);

    // const removedProjectArr = allProjects.filter((project, index) => index !== targetProject);
    // let updatedProjects = removedProjectArr;
    // return updatedProjects;
};

// export const tempUpdatedProjects = {
//     data: []
// }

// export function updateProject(newProjectsArr) {
//     tempUpdatedProjects.data = newProjectsArr;
// }
    // removeTask(id) {
    //     this.id = id;
    //     this.tasks = this.tasks.filter(task => task.id != id);
    // }

addProject(firstProject);
addProject(secondProject);

export { Project, allProjects, updatedProjects, addProject, removeProject };


/*
Psuedo Code for Projects.js

Classes

    Tasks:
        Constructor args (title, description, date, priority, tags, comments)
            reference to all using title = this.title;
            include this.id = crypto.randomUUID();
    
        Projects:
            Constructor args (title)
                reference title = this.title
                include this.id = crypto.randomUUID();
                this.tasks = [];
            Functions:
                addTask(title, description, date, priority, tags, comments, id)
                    let newTask = new Task(title, description, date, priority, tags, comments, id)

                    const commentsArr = [];

                    // If comments is empty, push empty array, not empty string to commentsArr.
                    if (comments === '') {
                        comments = [];
                    } else {
                        commentsArr.push(comments);
                    }

                    // commentsArr.push(comments);
                    newTask.comments = commentsArr;

            this.tasks.push(newTask);

            removeTask(id) {
                this.id = id;
                this.tasks = this.tasks.filter(task => task.id != id);
            }
            
            editTask(title, description, date, priority, tags, comments, id) {
                // Pull tasks array, find array with id, update data.
                const targetId = id;
                const foundTask = this.tasks.find(item => item.id === targetId);
                console.log('edit task fired');
                const commentsArr = [];

                // If comments is empty, push empty array, not empty string to commentsArr.
                // Push existing comments and new comments to commentsArr.
                if (comments === '') {
                    comments = [];
                } else {
                    commentsArr.push(comments);
                };

                if (foundTask) {
                    foundTask.title = title;
                    foundTask.description = description;
                    foundTask.date = date;
                    foundTask.priority = priority;
                    foundTask.tags = tags;
                    foundTask.comments = commentsArr;
                } else {
                    console.log('Task not found');
            };
        };

        getTask(id) {
            return this.tasks.find(task => task.id === id);
        }