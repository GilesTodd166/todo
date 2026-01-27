/*
projects
    tasks
        title
        description
        priority
        date
        tags
        comments
*/
// import { format } from "date-fns";

import { be } from "date-fns/locale";

// let date = new Date();

// let formattedDate = format(date, 'yyyy-MM-dd');

class Task {
    constructor(title, description, date, priority, tags, comments) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.tags = tags;
        this.comments = comments;
        this.id = crypto.randomUUID();
    };
}

class Project {

    constructor(title) {
        this.title = title;
        this.tasks = [];
    }

    addTask(title, description, date, priority, tags, comments, id) {
        let newTask = new Task(title, description, date, priority, tags, comments, id);
        
            if (comments === '') {
            } else {
                const commentsArr = [];
                commentsArr.push(comments);
                newTask.comments = commentsArr;
            };
            
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

    removeTask(id) {
        this.id = id;
        this.tasks = this.tasks.filter(item => item.id != id);
    }
}

// // Instance of a new Project
// let firstProject = new Project("My First Project");

// firstProject.addTask("Task Name", "Description of the task saved", "high", "25-03-2026", "SingleTag", "This is a comment saved on the task");

// // firstProject.removeTask("WORKS WITH SPECIFIC ID - LATER USE THIS.ID as arg, worked on button in library");

// console.log(firstProject.tasks);

export { Project };