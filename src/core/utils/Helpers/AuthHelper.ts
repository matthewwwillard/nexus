import * as jwt from 'jsonwebtoken';
import {Nexus} from "../../Nexus";


export class AuthHelper
{
    public bcrypt = require('bcrypt');
    public uuid = require('uuid/v4');

    public generateToken(data:object)
    {
        return jwt.sign({data:data}, Nexus.settings.APP_ENCRYPT_KEY, {expiresIn:'1 day'});
    }
    public verifyToken(token:string)
    {
        return jwt.verify(token, Nexus.settings.APP_ENCRYPT_KEY);
    }
    public decodeToken(token:string)
    {
        return jwt.decode(token);
    }
    public passwordIsSame(plainText:string, encryptedPassword:string) : boolean
    {
        return this.bcrypt.compareSync(plainText, encryptedPassword);
    }
}