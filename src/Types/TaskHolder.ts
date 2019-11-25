import DBItem from "./DBItem";
import PrioritizedList from "./PrioritizedList";
import { Task, TaskStatus } from "./Task";

export default class TaskHolder extends DBItem {
    public taskColumns: PrioritizedList[];
    constructor() {
        super();
        this.taskColumns = [];
    }

    public GetTask(identifier: string) {
        let task: Task;
        this.taskColumns.forEach((c) => {
            if (!task) {
                const columnTask = c.GetTask(identifier);
                if (columnTask) {
                    task = columnTask;
                }
            }
        });

        return task;
    }

    public AddTask(newTask: Task) {

        this.GetColumn(TaskStatus.New).AddTask(newTask);
        return newTask;
    }

    public RemoveTask(task: Task) {
        this.GetColumn(task.status).RemoveTask(task);
        return task;
    }

    public ChangeTaskStatus(task: Task, newStatus: TaskStatus) {

        this.GetColumn(task.status).RemoveTask(task);
        this.GetColumn(newStatus).AddTask(task);
        task.status = newStatus;
    }

    private GetColumn(status: TaskStatus) {
        const existingColumn = this.taskColumns.find((c) => c.name === status);
        if (existingColumn) {
            return existingColumn;
        } else {
            const newColumn = new PrioritizedList(status);
            this.taskColumns.push(newColumn);
            return newColumn;
        }
    }
}
