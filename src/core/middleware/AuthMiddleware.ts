import {ResultsHelper} from "../utils/ResultsHelper";

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
}