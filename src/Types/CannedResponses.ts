import { Request, Response } from "express";

export interface ICannedResponse {
    getInterpolatedMessage: (Request) => string | undefined;
    message: string| undefined;
    status: number;
}

export function SendCannedResponse(cannedResponse: ICannedResponse, req: Request, res: Response) {
    res.status(cannedResponse.status);
    if (cannedResponse.message) {
        res.send(cannedResponse.message);
    } else {
        res.send(cannedResponse.getInterpolatedMessage(req));
    }
}

export class CannedResponses {
    public static TeamNameExists: ICannedResponse =
    {
        getInterpolatedMessage: undefined,
        message: "Team with this name already exists",
        status: 400
    };

    public static TeamDoesNotExist: ICannedResponse =
    {
        getInterpolatedMessage: (req) => `Couldn't find team with name or id ${req.params.identifier}`,
        message: undefined,
        status: 404
    };

    public static TaskDoesNotExist: ICannedResponse =
    {
        getInterpolatedMessage: (req) => `Couldn't find task with name or id ${req.params.taskId}`,
        message: undefined,
        status: 404
    };

    public static NeedName: ICannedResponse =
    {
        getInterpolatedMessage: undefined,
        message: "Couldn't find valid entry for 'name' in body",
        status: 400
    };

    public static InvalidStatus: ICannedResponse =
    {
        getInterpolatedMessage: (req) => `Status ${req.params.status} is not a valid status`,
        message: undefined,
        status: 400
    };
}
