class Tags {
    constructor() {
        this.tagsArr = [];
    };
    addTag(tag) {
        const newTag = {
            id: crypto.randomUUID(),
            name: tag
        };
        this.tagsArr.push(newTag);
        return newTag;
    };
    removeTag(id) {
        this.tagsArr = this.tagsArr.filter(tag => tag.id !== id);
    };
    getTagById(id) {
        return this.tagsArr.find(tag => tag.id === id);
    };
};

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

    removeTag(currentTask, tagIndex) {
        let currentTaskTag = currentTask.tags;
            currentTaskTag.splice(tagIndex, 1);
    };

};

class Project {
    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.tasks = [];
    };

        addOrEditTask(title, description, date, priority, tags, comments, id) {
        if (!id) {
            console.log('add task fired', id);
            let newTask = new Task(title, description, date, priority, tags, comments, id);

                this.tasks.push(newTask);
                    return;

        } else {
            // Pull tasks array, find array with id, update data.
            const targetId = id;
            const foundTask = this.tasks.find(item => item.id === targetId);
            console.log('edit task fired');

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

    removeComment(currentTask, commentIndex) {
        let currentTaskComments = currentTask.comments
            currentTaskComments.splice(commentIndex, 1);
    };

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id != id);
    };

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    };
};

// Projects Array.
const allProjects = [];

function addProject(project) {
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

// Match any tasks across all projects with the tag name arg.
// Send data back to build/render the screen with tags.
function getTasksWithTag(tag) {
    // console.log(allProjects);
    // console.log(tag);

    allProjects.forEach((projects) => {
        let projectTasks = projects.tasks

        projectTasks.forEach((tasks) => {
            // console.log(tasks.tags)

            // STOP -- Here we have all the tags in each task rendered.
            //         First I think I need to build the front end functionality
            //         of adding/removing tags to each task, then come back
            //         to build the comparison logic.

        });
    });
}

// Instance of Tags Array
const allTags = new Tags();

allTags.addTag("TagOne");
allTags.addTag("TagTwo");
// function addTag(tag) {
//     allTags.push(tag);
// };

// function removeTag(tag) {
//     // Unsure this will function correctly, hopefully don't need ID's
//     allTags.splice(tag, 1);
// }

// Instance of a new Project
let firstProject = new Project("My First Project");
let secondProject = new Project("My Second Project");
addProject(firstProject);
addProject(secondProject);

// Makes firstProject globally scoped.
window.firstProject = firstProject;
window.secondProject = secondProject;

firstProject.addOrEditTask("Task One", "Description of the task saved", "03-05-2026", "Low", ["TagOne"], ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
firstProject.addOrEditTask("Task Two", "Description of the task saved", "03-05-2026", "High", [], ["A second comment", "Two comments"]);
firstProject.addOrEditTask("Task Three", "Description of the task saved", "03-05-2026", "Medium", ["TagOne", "TagTwo",], ["A single saved comment"]);

secondProject.addOrEditTask("2nd Project Task One", "Description of the task saved", "03-05-2026", "High", ["TagOne"], ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
secondProject.addOrEditTask("2nd Project Task Two", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TagTwo",], ["A single saved comment"]);

export { Project, allProjects, addProject, removeProject, getProjectById, getTasksWithTag, allTags};