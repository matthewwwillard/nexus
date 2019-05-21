import {Nexus} from "../../core/Nexus";
export class AuthMiddleware
{
    public static BasicAuthCheck(req,res,next)
    {
        try
        {
            let body = req.body;

            if(!body.hasOwnProperty('username'))
            {
                return Nexus.helpers.results.sendResult(res, {message:'Missing required Param username!'}, 401);
            }
            if(!body.hasOwnProperty('password'))
            {
                return Nexus.helpers.results.sendResult(res, {message:'Missing required Param password!'}, 401);
            }
            res.locals.user = {
                username:body['username'],
                password:body['password']
            };

            next();
        }
        catch(err)
        {
            return Nexus.helpers.results.sendResult(res, {message:'Bad Response! ERROR: ' + err.messasge}, 500);
        }
    }
    public static async TokenCheck(req, res, next)
    {
        try {
            
            
            let token = req.body != null && req.body.token != null ? req.body.token : req.get('token');

            if(token == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing Requirements'}, 401);

            if(!Nexus.helpers.auth.verifyToken(token))
                return Nexus.helpers.results.sendResult(res, {message:'Invalid Token'}, 401);

            let data = Nexus.helpers.auth.decodeToken(token);
            
            if(data['data']['isApiToken'] != null)
                return Nexus.helpers.results.sendResult(res, {message:"Missing Rights"}, 403);
            
            res.locals.user = data['data'];

            next();

        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async IsSuperUser(req, res, next)
    {
        try {
            if(res.locals.user.superUser)
                return next();
            return Nexus.helpers.results.sendResult(res, {message:'You lack the permissions to perform this task!'}, 401);
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }

    public static async DebugMode(req, res, next)
    {
        try {
            let debugMode = Nexus.settings.DEBUG_MODE.toLowerCase() == 'true';

            if(!debugMode)
                return Nexus.helpers.results.sendResult(res, {message:"UNABLE TO REACH CALL"}, 401);

            next();
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
}