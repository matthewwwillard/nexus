
import * as md5 from 'md5';
import {Nexus} from "../../Nexus";
import {Users} from "../../../db/models/Users";

var mailchimp = require('mailchimp-api-v3');
var mandrill = require('mandrill-api/mandrill');


export enum MANDRILL_MERGE_VARS
{
    EMAIL="MERGE0",
    NEW_PASSWORD="new_password"
}

export interface MANDRIL_VAR {
    name:MANDRILL_MERGE_VARS,
    content:string
}

export enum MANDRILL_TEMPLATES
{
    PASSWORD_RESET="password-reset"
}

export interface MailChimpUserObject {
    email:string,
    status?:string,
    uuid?:string
}

export class MailchimpHelper
{
    private mailchimpApi = null;
    private mandrillApi = null;
    
    private listId:any = "";
    private defaultFrom:string = "no-reply@nexus.com";
    
    constructor() {

        if(Nexus.settings.MAIL_CHIMP_KEY == null || Nexus.settings.MAIL_CHIMP_KEY.length <= 0)
            return;

        this.mailchimpApi = new mailchimp(Nexus.settings.MAIL_CHIMP_KEY);
        this.mandrillApi = new mandrill.Mandrill(Nexus.settings.MANDRILL_KEY);
        this.defaultFrom = Nexus.settings.MANDRILL_DEFAULT_FROM;
        this.listId = Nexus.settings.MAIL_CHIMP_LIST;
    }
    
    public async addUserToList(user:MailChimpUserObject)
    {
        try {
            if (user.status == null)
                user.status = 'subscribed';
    
            await this.mailchimpApi.request({
                method: 'post',
                path: '/lists/' + this.listId + '/members',
                body: {
                    email_address: user.email,
                    status: user.status
                }
            });
            
            return true;
        }
        catch (e) {
            console.log(e);
            return false
        }
    }
    
    public async removeUserFromList(email:string)
    {
        try
        {
            let hashEmail = md5(email);
            
            let r = await this.mailchimpApi.request({
               method:'DELETE',
               path:'/lists/'+ this.listId + '/members/' + hashEmail
            });
            
            console.log(r);
            
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    
    public async sendEmail(user:Users, template:MANDRILL_TEMPLATES, mergeVars:MANDRIL_VAR[], templateVars:any[] = [])
    {
        try
        {
            let mandrillData = this.generateMandrillObj(user, mergeVars);
       
            let res = await new Promise((resolve, reject) => {
                this.mandrillApi.messages.sendTemplate({"template_name":template, "template_content": templateVars, "message": mandrillData},resolve, reject);
            });
            
            console.log(res);
            
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    
    public async getUsersOnList()
    {
        try
        {
            let users = await this.mailchimpApi.get('/lists/'+this.listId+'/members');
            
            let finalUsers:MailChimpUserObject[] = [];
            
            for(let user of users.members)
            {
                finalUsers.push(
                    {
                        email:user.email_addresse,
                        uuid:user.unique_email_id
                    }
                );
            }
            
            return finalUsers;
            
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    
    private generateMandrillObj(user:Users, variables:any)
    {
        
        return {
            "html": "",
            "text": "",
            "subject": "",
            "from_email": this.defaultFrom,
            "from_name": "Nexus Team",
            "to": [{
                "email": user.email,
                "name": user.firstName + ' ' + user.lastName,
                "type": "to"
            }],
            "headers": {
                "Reply-To": this.defaultFrom
            },
            "global_merge_vars":variables
        };
        
    }
    
}