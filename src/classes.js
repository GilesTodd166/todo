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
            // Update localStorage
            setProject();
            setTag();
                return newTag;
    };
    removeTag(id) {
        this.tagsArr = this.tagsArr.filter(tag => tag.id !== id);
            // Update localStorage
            setProject();
            setTag();
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
            let newTask = new Task(title, description, date, priority, tags, comments, id);

                this.tasks.push(newTask);
                    // Update localStorage                
                    setProject();
                        return;

        } else {
            // Pull tasks array, find array with id, update data.
            const targetId = id;
            const foundTask = this.tasks.find(item => item.id === targetId);

            if (foundTask) {
                foundTask.title = title;
                foundTask.description = description;
                foundTask.date = date;
                foundTask.priority = priority;
                foundTask.tags = tags;
                foundTask.comments = comments;
            } else {
                console.log('Task not found');
            };
        };
        // Update localStorage      
        setProject();
    };

    removeComment(currentTask, commentIndex) {
        let currentTaskComments = currentTask.comments
            currentTaskComments.splice(commentIndex, 1);
                // Update localStorage      
                setProject();
    };

    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id != id);
            // Update localStorage      
            setProject();
    };

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    };
};

// Projects Array.
let allProjects = getProject();

function addProject(projectTitle) {
    const project = new Project(projectTitle);
    allProjects.push(project);
        setProject();
};

function removeProject(projectId) {
    const projectToRemove = allProjects.findIndex(project => project.id === projectId);

    if (projectToRemove !== -1) {
        allProjects.splice(projectToRemove, 1);
    };
    // Update localStorage
    setProject();
};

function getProjectById(projects, id) {
    // this might need work as it may return null based on argument input.
    return projects.find(project => project.id === id) || null;
};

// Match any tasks across all projects with the tag name arg.
function getTasksWithTag(tag) {

    // flatMap returns every task in every project in one array.
    // filter and includes checks each task for matching tags to tag argument.
    const foundTasks = allProjects.flatMap(project => project.tasks.filter(task => task.tags.includes(tag)));

    return foundTasks;
};

// ----- Storage -----

function setProject() {
    localStorage.setItem("projects", JSON.stringify(allProjects));
};

function getProject() {
    const stored = localStorage.getItem("projects");
    const storedTags = localStorage.getItem("tags");
  
    if (!stored) return [];

    const rawProjects = JSON.parse(stored);

    // reconstruct Project and Task instances
    const projects = rawProjects.map(p => {
        const project = new Project(p.title);
        project.id = p.id; // preserve original id

        // reconstruct tasks
        project.tasks = p.tasks.map(t => {
            const task = new Task(t.title, t.description);
            task.id = t.id;
            task.date = t.date;
            task.priority = t.priority;
            task.tags = t.tags || [];
            task.comments = t.comments || [];
                return task;
            });

            return project;
    });
    return projects;
};

// Instance of Tags Array
let allTags = getTags();

function setTag() {
    localStorage.setItem("tags", JSON.stringify(allTags.tagsArr));
};

function getTags() {
    const stored = localStorage.getItem("tags");

    if (!stored) return;

    const rawTags = JSON.parse(stored);

    // Reconstruct Tag instance
    const tagsInstance = new Tags();
        // Reconstruct each tag and push to tagsInstance
        rawTags.forEach((tag) => {
            tagsInstance.tagsArr.push(tag);
        });

    return tagsInstance;
};

// allTags.addTag("TagOne");
// allTags.addTag("TagTwo");

// Instance of a new Project
// let firstProject = new Project("My First Project");
// let secondProject = new Project("My Second Project");
// addProject(firstProject);
// addProject(secondProject);

// Makes firstProject globally scoped.
// window.firstProject = firstProject;
// window.secondProject = secondProject;

// firstProject.addOrEditTask("Task One", "Description of the task saved", "03-05-2026", "Low", ["TagOne"], ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
// firstProject.addOrEditTask("Task Two", "Description of the task saved", "03-05-2026", "High", [], ["A second comment", "Two comments"]);
// firstProject.addOrEditTask("Task Three", "Description of the task saved", "03-05-2026", "Medium", ["TagOne", "TagTwo",], ["A single saved comment"]);

// secondProject.addOrEditTask("2nd Project Task One", "Description of the task saved", "03-05-2026", "High", ["TagOne"], ["This is a comment saved on the task", "A second comment", "A third comment", "A fourth"]);
// secondProject.addOrEditTask("2nd Project Task Two", "Description of the task saved", "03-05-2026", "Low", ["OneTag", "TagTwo",], ["A single saved comment"]);

// storeProject(firstProject);
// storeProject(secondProject);

export { allProjects, 
         addProject, 
         removeProject, 
         getProjectById,
         getProject, 
         allTags, 
         getTasksWithTag 
        };