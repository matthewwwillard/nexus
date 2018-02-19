import * as web from 'express-decorators';
import {ActivityMiddleware} from "../middleware/ActivityMiddleware";
import {ResultsHelper} from "../utils/ResultsHelper";
import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {CanEmail} from "../utils/email/CanEmail";
import {RESTApi} from "../RestAPI";

@web.basePath('/api/test')
export default class TestController extends CanEmail
{
    constructor()
    {
        //Currently using SG to send emails, can be adjusted to new services
        super(RESTApi.instance.appSettings.SG_API_TOKEN);
    }
    @web.get('/',[ActivityMiddleware.TrackActivity, AuthMiddleware.BasicAuthCheck])
    async index(req, res)
    {
        try
        {
            return ResultsHelper.sendResult(res, {message:'Received!'}, 200);
        }
        catch (err)
        {
            return ResultsHelper.sendResult(res, {message:'Bad Request! Error: ' + err.message}, 500);
        }
    }
    @web.get('/:email', [ActivityMiddleware.TrackActivity])
    async emailTester(req, res)
    {
        try
        {
            let success = await this.emailSender.sendSingleEmail(req.params.email, 'no-reply@nexus-api.com','Example email!', 'welcome', {
                link:'http://google.com',
                fullname:'Example email!'
            });
            return ResultsHelper.sendResult(res, {message:'Email has ' + (success ? 'sent' : 'failed')}, success ? 200:500);
        }
        catch (err)
        {
            return ResultsHelper.sendResult(res, {message:'Error ' + err.message}, 500);
        }
    }
}