// Imports
import * as express from "express";
import { Request, RequestHandler } from "express";
import { CannedResponses, ICannedResponse, SendCannedResponse } from "./Types/CannedResponses";
import DBContext from "./Types/DBContext";
import IQueryable from "./Types/IQueryable";
import { Task, TaskStatus } from "./Types/Task";
import Team from "./Types/Team";

// Setting up App
const app = express();
const port = 8080;
app.use(express.json());

// Data Storage
const db = new DBContext();

interface IRequestHandler {
    handlerFunction: RequestHandler;
    method: string;
    route: string;
}

const DoOrSendCannedResponse = (thing: any, response: ICannedResponse, req, res, stuffToDo: () => void) => {
    if (thing) {
        stuffToDo();
    } else {
        SendCannedResponse(response, req, res);
    }
};

app.post("/teams", (req, res) => {
    DoOrSendCannedResponse(db.GetTeam(req.body.name) === undefined,
    CannedResponses.TeamNameExists, req, res, () => {
        const result = new Team(req.body.name);
        db.teams.push(result);
        res.send(JSON.stringify(result));
    });
});

app.put("/teams/:identifier", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const notSameName = team.name !== req.body.name;
        const notDuplicateName = db.teams.every((t) => t.name !== req.body.name);
        const notDuplicateTeamNameAndNotSameName = ( notSameName && notDuplicateName );

        DoOrSendCannedResponse(notDuplicateTeamNameAndNotSameName,
            CannedResponses.TeamNameExists, req, res,
            () => {
                team.name = req.body.name;
                res.send(team);
            });
    });
});

app.get("/teams", (req, res) => {
    res.send(JSON.stringify(db.teams));
});

app.get("/teams", (req, res) => {
    res.send(JSON.stringify(db.teams.filter((team) => team.Query(req.query.name.toLowerCase()))));
});

app.get("/teams/:identifier", (req, res) => {
    res.send(JSON.stringify(db.GetTeam(req.params.identifier)));
});

// Retrieves by id or name
app.post("/teams/:identifier/tasks", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const newTask: Task = Task.TaskFromRequest(req);
        team.AddTask(newTask);
        res.send(JSON.stringify(newTask));
    });

});

app.get("/teams/:identifier/tasks/:taskId", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const task = team.GetTask(req.params.taskId);

        DoOrSendCannedResponse(task, CannedResponses.TaskDoesNotExist, req, res, () => {
            res.send(task);
        });
    });
});

app.delete("/teams/:identifier/tasks/:taskId", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const task = team.GetTask(req.params.taskId);

        DoOrSendCannedResponse(task, CannedResponses.TaskDoesNotExist, req, res, () => {
            team.RemoveTask(task);
            res.send(task);
        });
    });
});

app.put("/teams/:identifier/tasks/:taskId", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const task = team.GetTask(req.params.taskId);

        DoOrSendCannedResponse(task, CannedResponses.TaskDoesNotExist, req, res, () => {
            DoOrSendCannedResponse(req.body.name, CannedResponses.NeedName, req, res, () => {
                task.UpdateFromRequest(req);
                res.send(task);
            });
        });
    });
});

app.patch("/teams/:identifier/tasks/:taskId/status/:status", (req, res) => {
    const team = db.GetTeam(req.params.identifier);

    DoOrSendCannedResponse(team, CannedResponses.TeamDoesNotExist, req, res, () => {
        const task = team.GetTask(req.params.taskId);

        DoOrSendCannedResponse(task, CannedResponses.TaskDoesNotExist, req, res, () => {
            const status = req.params.status as TaskStatus;

            DoOrSendCannedResponse(Object.values(TaskStatus).includes(status),
            CannedResponses.InvalidStatus, req, res, () => {
                team.ChangeTaskStatus(task, status);
                res.send(task);
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
