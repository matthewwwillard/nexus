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
    public static FacebookAuthCheck(req, res, next)
    {
        try{

        }
        catch (err)
        {

        }
    }
    public static async TokenCheck(req, res, next)
    {
        try {
            let token = req.body.hasOwnProperty('token') ? req.body.token : req.get('token');

            if(token == null)
                return ResultsHelper.sendResult(res, {message:'Missing Requirements'}, 401);

            if(!AuthHelper.verifyToken(token))
                return ResultsHelper.sendResult(res, {message:'Invalid Token'}, 401);

            let data = AuthHelper.decodeToken(token);

            res.locals.user = data['data'];

            next();

        }
        catch (e) {
            return ResultsHelper.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async IsSuperUser(req, res, next)
    {
        try {
            if(res.locals.user.superUser)
                return next();
            return ResultsHelper.sendResult(res, {message:'You lack the permissions to perform this task!'}, 401);
        }
        catch (e) {
            return ResultsHelper.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async IsMusicianUser(req, res, next)
    {
        try {
            if(res.locals.user.musician)
                return next();
            return ResultsHelper.sendResult(res, {message:'You lack the permissions to perform this task!'}, 401);
        }
        catch (e) {
            return ResultsHelper.sendResult(res, {message:e.message}, 500);
        }
    }
    public static async IsSuperUserOrMusician(req, res, next)
    {
        try {
            if (res.locals.user.musician || res.locals.user.superUser)
                return next();

            return ResultsHelper.sendResult(res, {message: 'You lack the permissions to perform this task!'}, 401);
        }
        catch (e) {
            return ResultsHelper.sendResult(res, {message:e.message}, 500);
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