import {ActivityMiddleware} from "../middleware/ActivityMiddleware";
import {UsersMiddleware} from "../middleware/UsersMiddleware";
import {getConnection, Not, Like} from "typeorm";
import {Nexus} from "../../core/Nexus";
import {Users} from "../../db/models/Users";

@Nexus.http.baseRoute('/api/v1/users')
export class UsersController
{


    /**
     * @api {post} /api/v1/users/ Create User
     * @apiName CreateUser
     * @apiGroup Users
     *
     * @apiParam {string} email The user's email
     * @apiParam {string} firstName user's first name
     * @apiParam {string} lastName user's last name
     * @apiParam {string} password The user's password, plain text, will be encrypted
     * @apiParam {string} [sex] user's sex
     * @apiParam {string} [birthday] user's birthday
     * @apiParam {string} [pushId] user's push id for device
     * @apiParam {string} [deviceType] user's device IOS or ANDROID
     * @apiParam {string} [facebookTokenKey] Facebook login token
     */

    @Nexus.http.post('/', [ActivityMiddleware.TrackActivity, UsersMiddleware.UserDataCheck])
    async createUsers(req, res)
    {
        try {
            let userData = res.locals.userData;
            let user = new Users();
            
            
            let passwordHash = await Nexus.helpers.auth.bcrypt.hashSync(userData.password, Number(Nexus.settings.SALT_ROUNDS));
            
            
            let emailCheck = await getConnection().getRepository(Users).findOne({
                where:{
                    email:userData.email,
                    isDeleted:false
                }
            });

            if(emailCheck != null)
                return Nexus.helpers.results.sendResult(res, {message:'Email in use!'}, 400);
            
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            
            if(userData.deviceType != null)
                user.deviceType = userData.deviceType;

            user.email = userData.email;
            user.password = passwordHash;

            await getConnection().getRepository(Users).save(user);
            
            if(userData.pushId != null) {
                await Nexus.helpers.push.registerUserForPush(user, userData.pushId);
            }
    
            let flat = await Users.findOneById(user.id);
            
            let token = await Nexus.helpers.auth.generateToken(flat);

            return Nexus.helpers.results.sendResult(res, {
                user:user,
                token:token
            });

        }
        catch (e) {
            console.log(e.message);
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }

}