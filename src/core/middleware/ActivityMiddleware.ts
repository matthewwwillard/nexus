/***
 *  ActivityMiddleware
 *  - Designed to record requests made to the server!
 */
import {getConnection} from "typeorm";
import {ActivityTracker} from "../db/models/ActivityTracker";

export class ActivityMiddleware {
    public static TrackActivity(req, res, next)
    {
        try
        {
            let activityData:object = {
                ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                browser:req.headers['user-agent'],
                requestType:req.method,
                requestEndPoint:req.originalUrl
            };
            res.locals.activity = activityData;
        }
        catch (err)
        {
            //We don't want to stop requests from happening just cause we error'd out!
            console.log('Unable to track activity! ERROR: ' + err.message);
        }

        next();
    }
    public static async CompleteActivityTrack(res)
    {
        try
        {
            let db = getConnection();
            let activityData = res.locals.activity;
            let activity = new ActivityTracker();
            activity.browser = activityData['browser'];
            activity.ip = activityData['ip'];
            activity.returnStatus = activityData['returnStatus'];
            activity.requestEndPoint = activityData['requestEndPoint'];
            activity.requestType = activityData['requestType'];


            await db.getRepository(ActivityTracker).save(activity);

        }
        catch(err)
        {
            console.log('Unable to persist activity data! ERROR: ' + err.message);
        }
    }
}