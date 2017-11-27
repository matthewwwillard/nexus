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
            return await res.status(status).json({
                data:data
            }).end();
        }
        catch(err)
        {
            Logger.LogMessage('Unable to return request!' + err.message, "red");
            return false;
        }
    }
    public static HttpErrors = {
        FORBIDDEN:403,
        MISSING:404,
        SUCCESS:200,
        UNAUTHORIZED:401,
        SERVER_ERROR:500,
        IN_USE:208
    }

}