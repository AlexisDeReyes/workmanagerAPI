import { Task } from "./Task";
import Team from "./Team";

export class TeamTaskResponse {

    public Team: Team;
    public Task: Task;
    constructor(team: Team, task: Task) {
        [this.Team, this.Task] = [team, task];
    }
}
