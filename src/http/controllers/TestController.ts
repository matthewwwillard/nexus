import {AuthMiddleware} from "../middleware/AuthMiddleware";
import {Nexus} from "../../core/Nexus";
var crypto = require('crypto-js');

@Nexus.http.baseRoute('/api/v1/test')
export class TestController
{
    @Nexus.http.get("/mailchimp/list", [AuthMiddleware.DebugMode])
    async getMailChimpTest(req, res)
    {
        try
        {
            let email = await Nexus.helpers.mailchimp.getUsersOnList();
            
            console.log(email);
            
            return Nexus.helpers.results.sendResult(res, {things:email});
            
        }
        catch (e) {
            return Nexus.helpers.results.sendResult(res, {message:e.message}, 500);
        }
    }
    
}