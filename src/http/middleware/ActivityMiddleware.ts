/***
 *  ActivityMiddleware
 *  - Designed to record requests made to the server!
 */
import {getConnection} from "typeorm";
import {ActivityTracker} from "../../db/models/ActivityTracker";

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
    public static async CompleteActivityTrack(res, data = null)
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

            // if(data != null)
            //     activity.payload = JSON.stringify(ActivityMiddleware.CleanDataObject(data));

            if(res.locals.user != null)
                activity.user = res.locals.user;
            
            if(res.locals.apiKeys != null)
            {
                activity.email = res.locals.apiKeys.email;
            }


            await db.getRepository(ActivityTracker).save(activity);

        }
        catch(err)
        {
            console.log('Unable to persist activity data! ERROR: ' + err.message);
        }
    }
    public static async CleanDataObject(data)
    {
        let tempData = Object.assign({},data);
        let removeNames = [
            "password",
            "token",
            "email"
        ];

        let dataKeys = Object.keys(tempData);

        console.log(dataKeys);

        for(let i = 0; i < dataKeys.length; i++)
        {
            if(tempData[dataKeys[i]] == null)
                continue;

            if(typeof tempData[dataKeys[i]] === 'object')
            {
                console.log(dataKeys[i] + ' is an object!');
                tempData[dataKeys[i]] = await ActivityMiddleware.CleanDataObject(tempData[dataKeys[i]]);
            }

            if(removeNames.indexOf(dataKeys[i]) >= 0)
                delete tempData[dataKeys[i]];
        }

        return tempData;

    }
}