import {ResultsHelper} from "../utils/ResultsHelper";

export class PaginatorMiddleware
{
    public static async HasPaginatorObject(req, res, next)
    {
        try
        {
            if(!req.body.hasOwnProperty('paginatorSettings'))
                return ResultsHelper.sendResult(res, {message:'Missing require settings for Paginator!'}, 400);
            res.locals.paginatorSettings = req.body.paginatorSettings;
            next();
        }
        catch (err)
        {
            return ResultsHelper.sendResult(res, {message:err.message}, 500);
        }
    }
}