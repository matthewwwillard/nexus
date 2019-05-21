import {ActivityMiddleware} from "../../../http/middleware/ActivityMiddleware";
import {Logger} from "../Logger";
import {Nexus} from "../../Nexus";




export class ResultsHelper
{
    public async sendResult(res, data, status:number = 200)
    {
        try
        {
            if(res.hasOwnProperty('locals') && res.locals['activity'] != null)
            {
                res.locals['activity']['returnStatus'] = status;
                await ActivityMiddleware.CompleteActivityTrack(res,data);
            }
            return await res.status(status).json(
                data
            ).end();
        }
        catch(err)
        {
            Logger.LogMessage('Unable to return request!' + err.message, "red");
            return false;
        }
    }

    /**
     *
     * Checks if an Object as the required properties. Accepts a string array, or a class reference. See notes in https://confluence.printsites.io/pages/viewpage.action?pageId=47022947
     *
     * @param {object} object
     * @param {string[] | object} keys
     * @returns {Promise<boolean>}
     */
    public async objectHasProperties(object:object, required:string[]|object)
    {
        if(object == null)
            return false;

        if(Array.isArray(required)) {
            let allKeys = Object.keys(object);

            for (let key of required) {
                if (allKeys.indexOf(key) < 0 || object[key] == null || object[key].length <= 0)
                    return false;
            }
        }
        else
        {
            let requiredKeys:string[] = Object.keys(required);
            let allKeys = Object.keys(object);

            for (let key of requiredKeys) {
                if (allKeys.indexOf(key) < 0 || object[key] == null || object[key].length <= 0)
                    return false;
            }
        }
        return true;
    }


    public generateMachineName(name:string)
    {
        let step1 = name.replace(/[/]/gmi, '');

        let underscored = step1.replace(/[ \-,&]/gmi, '_');

        return underscored.toUpperCase();

    }
    
    public HttpErrors = {
        FORBIDDEN:403,
        MISSING:404,
        SUCCESS:200,
        UNAUTHORIZED:401,
        SERVER_ERROR:500,
        IN_USE:208
    }

}