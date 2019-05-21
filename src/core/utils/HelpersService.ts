import {FBHelper} from "./Helpers/FBHelper";
import {AuthHelper} from "./Helpers/AuthHelper";
import {ImageHelper} from "./Helpers/ImageHelper";
import {MailchimpHelper} from "./Helpers/MailchimpHelper";
import {PushHelper} from "./Helpers/PushHelper";
import {ResultsHelper} from "./Helpers/ResultsHelper";
import {SocketIOHelper} from "./Helpers/SocketIOHelper";
import {SlackHelper} from "./Helpers/SlackHelper";
import {ToyBox} from "./ToyBox/ToyBox";
import {Nexus} from "../Nexus";
import {TimeHelper} from "./Helpers/TimeHelper";

export class HelpersService
{
    public fb:FBHelper;
    public auth:AuthHelper;
    public images:ImageHelper;
    public mailchimp:MailchimpHelper;
    public push:PushHelper;
    public results:ResultsHelper;
    public io:SocketIOHelper;
    public slack:SlackHelper;
    public toyBox:ToyBox;
    public time:TimeHelper;

    constructor()
    {
        this.toyBox = new ToyBox({uploadDir: __dirname + '/' + Nexus.settings.TOYBOX_DIR,localImageURI:Nexus.settings.API_STATIC_IMAGE_URL});
        this.fb = new FBHelper();
        this.auth = new AuthHelper();
        this.images = new ImageHelper();
        this.mailchimp = new MailchimpHelper();
        this.push = new PushHelper();
        this.results = new ResultsHelper();
        this.io = new SocketIOHelper();
        this.slack = new SlackHelper();
        this.time = new TimeHelper();
    }
}