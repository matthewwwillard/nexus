import {Facebook, FacebookApiException} from 'fb';

export class FBHelper
{
    private fb:Facebook;
    constructor(appId, appSecret)
    {
        this.fb = new Facebook({appId:appId, appSecret:appSecret});
    }
    public async isValidToken(token:string) : Promise<Boolean>
    {
        try {

            this.fb.setAccessToken(token);
            let res = await this.fb.api('/debug_token', {input_token:token});

            if (!res || res.error) {
                console.error('FB ERROR:' + res.error);
                return false;
            }

            console.log(res);

            return res.data.is_valid;
        }
        catch (e) {
            console.error(e.message);
            return false;
        }
    }
}