import {ResultsHelper} from "../utils/ResultsHelper";
import * as jwt from 'jsonwebtoken';
import {RESTApi} from "../RestAPI";
import {AuthHelper} from "../utils/AuthHelper";

export class AuthMiddleware
{
    public static BasicAuthCheck(req,res,next)
    {
        try
        {
            let body = req.body;

            if(!body.hasOwnProperty('username'))
            {
                return ResultsHelper.sendResult(res, {message:'Missing required Param username!'}, 401);
            }
            if(!body.hasOwnProperty('password'))
            {
                return ResultsHelper.sendResult(res, {message:'Missing required Param password!'}, 401);
            }
            res.locals.user = {
                username:body['username'],
                password:body['password']
            };

            next();
        }
        catch(err)
        {
            return ResultsHelper.sendResult(res, {message:'Bad Response! ERROR: ' + err.messasge}, 500);
        }
    }
    
    public static async DebugMode(req, res, next)
    {
        try {
            let debugMode = RESTApi.instance.appSettings.DEBUG_MODE.toLowerCase() == 'true';

            if(!debugMode)
                return ResultsHelper.sendResult(res, {message:"UNABLE TO REACH CALL"}, 401);

            next();
        }
        catch (e) {
            return ResultsHelper.sendResult(res, {message:e.message}, 500);
        }
    }
}
