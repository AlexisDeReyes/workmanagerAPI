import IQueryable from "./IQueryable";
import TaskHolder from "./TaskHolder";

import { Request } from "express";

export class Task extends TaskHolder implements IQueryable {

    public static TaskFromRequest(req: Request) {
        const newTask = new Task(req.body.name);
        newTask.description = req.body.description;
        newTask.effort = req.body.effort;

        return newTask;
    }

    public name: string;
    public priority: number | undefined = -1;
    public description: string | undefined;
    public effort: number | undefined;
    public status: TaskStatus = TaskStatus.New;
    constructor(name: string) {
        super();
        this.name = name;
    }

    public UpdateFromRequest(req: Request) {
        this.description = req.body.description;
        this.effort = req.body.effort;
        this.name = req.body.name;
    }

    public Query(q: string) {
        return this.name.toLowerCase().indexOf(q) !== -1 || this.description.toLowerCase().indexOf(q) !== -1;
    }
}

export enum TaskStatus {
    New = "New",
    Ready = "Ready",
    InProgress = "In Progress",
    Done = "Done"
}
