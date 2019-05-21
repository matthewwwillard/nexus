import {Nexus} from "../../Nexus";

enum STATUS {
    OK="Ok",
    WARNING="Warning",
    DANGER="Danger!"
}
enum COLORS {
    GREEN='#36a64f',
    YELLOW="#e9a820",
    RED="#e01563"
}

export class SlackHelper
{

    private slackApi;

    constructor()
    {
        this.slackApi = this.slackApi = require('slack-notify')(Nexus.settings.SLACK_API);
    }

    public SendMessage(fallback:string, color:COLORS, pretext:string, title:string, text:string, status:STATUS = STATUS.OK)
    {
        this.slackApi.send({
            "attachments": [
                {
                    "fallback": fallback,
                    "color": color,
                    "pretext": pretext,
                    "author_name": "Notify",
                    "title": title,
                    "text": text,
                    "fields": [
                        {
                            "title": "Status Level",
                            "value": status,
                            "short": false
                        }
                    ],
                    "footer": "Notify",
                    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                }
            ]
        });
    }

    public SendMessageRaw(slackObj:any)
    {
        this.slackApi.send(slackObj);
    }
}