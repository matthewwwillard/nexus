import * as web from 'express-decorators';
import {ActivityMiddleware} from "../middleware/ActivityMiddleware";
import {ResultsHelper} from "../utils/ResultsHelper";
import {AuthMiddleware} from "../middleware/AuthMiddleware";

@web.basePath('/api/test')
export default class TestController
{
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
}