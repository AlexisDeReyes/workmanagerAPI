import IQueryable from "./IQueryable";
import { Task } from "./Task";

export default class PrioritizedList implements IQueryable {
    public name: string;
    public tasks: Task[];
    constructor(name: string) {
        this.name = name;
        this.tasks = [];
    }

    public GetTask(identifier: string) {
        return this.tasks.find((task) => task.name === identifier || task.id === identifier);
    }

    public AddTask(newTask: Task): Task {
        this.tasks.unshift(newTask);
        this.prioritize();
        return newTask;
    }

    public RemoveTask(taskToRemove: Task): Task {
        this.tasks = this.tasks.filter((task) => task.name !== taskToRemove.name && task.id !== taskToRemove.id);
        this.prioritize();
        return taskToRemove;
    }

    public Query(q: string) {
        return this.name.toLowerCase().indexOf(q) !== -1;
    }

    private prioritize() {
        this.tasks.forEach((task, index) => task.priority = index + 1);
    }
}
