import { Task } from "./Task";
import Team from "./Team";

export default class DBContext {
    public teams: Team[];
    constructor() {
        this.teams = [];
    }

    public GetTeam(teamIdentifier: string) {
        return this.teams.find((team) => {
            return team.name === teamIdentifier || team.id === teamIdentifier;
        });
    }
}
