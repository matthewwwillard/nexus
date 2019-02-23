import * as jwt from 'jsonwebtoken';
import {RESTApi} from "../RestAPI";

export class AuthHelper
{
    public static generateToken(data:object)
    {
        return jwt.sign({data:data}, RESTApi.instance.appSettings.APP_ENCRYPT_KEY, {expiresIn:'1 day'});
    }
    public static verifyToken(token:string)
    {
        return jwt.verify(token, RESTApi.instance.appSettings.APP_ENCRYPT_KEY);
    }
    public static decodeToken(token:string)
    {
        return jwt.decode(token);
    }
}