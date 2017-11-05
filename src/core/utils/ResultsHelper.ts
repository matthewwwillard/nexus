import {Logger} from "./Logger";
import {ActivityMiddleware} from "../middleware/ActivityMiddleware";

export class ResultsHelper
{
    public static async sendResult(res, data, status:number = 200)
    {
        try
        {
            if(res.hasOwnProperty('locals') && res.locals['activity'] != null)
            {
                res.locals['activity']['returnStatus'] = status;
                await ActivityMiddleware.CompleteActivityTrack(res);
            }
            return await res.json({
                data:data
            }).status(status).end();
        }
        catch(err)
        {
            Logger.LogMessage('Unable to return request!' + err.message, "red");
            return false;
        }
    }

}