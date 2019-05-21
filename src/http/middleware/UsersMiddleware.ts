import {Nexus} from "../../core/Nexus";

export class UsersMiddleware
{
    public static async BaseUserAuthCheck(req, res, next)
    {
        try
        {
            let body = req.body;

            if(! await Nexus.helpers.results.objectHasProperties(body, ['email', 'password']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing Auth Fields!'}, 404);

            res.locals.userData = body;

            next();

        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }

    public static async UserAdminDataCheck(req, res, next)
    {
        try {
            let body = req.body;

            if(body == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing requirements'}, 404);

            if(!await Nexus.helpers.results.objectHasProperties(body, ['email', 'firstName', 'lastName', 'password', 'superUser']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing user fields!'}, 404);

            res.locals.userData = body;

            next();

        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async UserAdminEditDataCheck(req, res, next)
    {
        try {
            let body = req.body;
            
            if(body == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing requirements'}, 404);
            
            if(!await Nexus.helpers.results.objectHasProperties(body, ['email', 'firstName', 'lastName', 'superUser']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing user fields!'}, 404);
            
            res.locals.userData = body;
            
            next();
            
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    
    public static async UserDataCheck(req, res, next)
    {
        try {
            let body = req.body;
            
            if(body == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing requirements'}, 404);
            
            if(!await Nexus.helpers.results.objectHasProperties(body, ['email', 'firstName', 'lastName', 'password']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing user fields!'}, 404);
            
            res.locals.userData = body;
            
            next();
            
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async UserUpdateDataCheck(req, res, next)
    {
        try {
            let body = req.body;
            
            if(body == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing requirements'}, 404);
            
            if(!await Nexus.helpers.results.objectHasProperties(body, ['email', 'firstName', 'lastName']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing user fields!'}, 404);
            
           
            res.locals.userData = body;
            
            next();
            
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async UserFacebookData(req, res, next)
    {
        try {
            let body = req.body;

            if(body == null)
                return Nexus.helpers.results.sendResult(res, {message:'Missing requirements'}, 404);
            
            if(!await Nexus.helpers.results.objectHasProperties(body, ['uuid', 'facebookToken', 'email', 'firstName', 'lastName']))
                return Nexus.helpers.results.sendResult(res, {message:'Missing user fields!'}, 404);

            res.locals.userData = body;

            next();

        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
}