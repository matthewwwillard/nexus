import { EmailSender } from "./EmailSender";

export class CanEmail
{
    protected emailSender:EmailSender;

    constructor(SG_API_KEY:string)
    {
        this.emailSender = new EmailSender(SG_API_KEY);
    }
}