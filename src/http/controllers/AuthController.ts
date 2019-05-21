import {ActivityMiddleware} from "../middleware/ActivityMiddleware";
import {Nexus} from "../../core/Nexus";
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {Users} from "../../db/models/Users";

@Nexus.http.baseRoute('/api/v1/auth')
export class AuthController
{
    /**
     * @api {put} /api/v1/auth/heartbeat Application Heartbeat
     * @apiName Application Heartbeat
     * @apiGroup Auth - User
     *
     *  @apiDescription Requires token header. Returns a refreshed user and token, should be called periodically for email logged in users.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "token": "token",
     *       "user": (user obj)
     *     }
     */
    @Nexus.http.put('/heartbeat', [ActivityMiddleware.TrackActivity, AuthMiddleware.TokenCheck])
    async loginTokenCheck(req, res)
    {
        try
        {
            let user = res.locals.user;
            
            //Get all new user object
            let newUser = await Users.findOneById(user.id);
            
            if(newUser == null)
                return Nexus.helpers.results.sendResult(res, {message:'Unable to find user!'}, 404);
            
            let token = await Nexus.helpers.auth.generateToken(newUser);
            
            return Nexus.helpers.results.sendResult(res,{
                token:token,
                user:newUser
            });
            
        }
        catch (e) {
        
        }
    }

}