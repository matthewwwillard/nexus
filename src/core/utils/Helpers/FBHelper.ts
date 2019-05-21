import {Facebook, FacebookApiException} from 'fb';
import {Nexus} from "../../Nexus";

export class FBHelper
{
    private fb:Facebook = null;
    constructor()
    {
        let appId = Nexus.settings.FACEBOOK_APP_ID;
        let secretId = Nexus.settings.FACEBOOK_SECRET_ID;

        if(appId == null ||secretId == null)
            return null;

        this.fb = new Facebook({appId:Nexus.settings.FACEBOOK_APP_ID, appSecret:Nexus.settings.FACEBOOK_SECRET_ID});
    }
    public async isValidToken(token:string) : Promise<Boolean>
    {
        try {
            
            //TODO: This may not work in the future, this basically checks to see if the user's token fails

            if(this.fb == null)
                return false;

            this.fb.setAccessToken(token);
            let res = await this.fb.api('/me', {access_token:token});

            if (!res || res.error) {
                console.error('FB ERROR:' + res.error);
                return false;
            }

            return true;
        }
        catch (e) {
            console.log('FB Exception')
            console.error(e.message);
            return false;
        }
    }
}