import * as fs from 'fs';

export class EmailSender
{
    private sgMail;
    constructor(apiKey:any)
    {
        this.sgMail = require('@sendgrid/mail');
        this.sgMail.setApiKey(apiKey);
    }

    public async sendSingleEmail(to:string, from:string, subject:string, template:string, args:object)
    {
        return await this.sendEmail(to, from, subject, template, args);
    }
    public async sendBulkEmail(to:string[], from:string, template:string, args:object[])
    {
        
    }
    private async parseEmailTheme(content:string, args:object)
    {
        let finalParse = content;
        for(let arg in args)
        {
            finalParse = finalParse.replace(new RegExp('%'+arg+'%','g'), args[arg].toString());
        }
        return finalParse;
    }
    private async sendEmail(t:string, f:string, s:string, template:string, args:object)
    {
        try
        {
            let emailTheme = await fs.readFileSync(__dirname + '/views/'+template+'.html','utf8');
            let content = await this.parseEmailTheme(emailTheme, args);

            await this.sgMail.send({
                to:t,
                from:f,
                subject:s,
                html:content
            });
            return true;
        }
        catch(err)
        {
            console.log(err.message);
            return false;
        }
        
    }

}

