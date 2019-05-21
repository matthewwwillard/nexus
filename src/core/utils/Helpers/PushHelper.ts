import * as apn from 'apn';
import * as request from 'request-promise-native';
import {Nexus} from "../../Nexus";
import {DEVICE_TYPE, Users} from "../../../db/models/Users";

var crypto = require('crypto-js');

export interface NotificationResponse {
    id:string,
    
}

export enum DEFAULT_PUSH_MESSAGES {
    HELLO='Hello {0}!'
}

export class PushHelper
{
    private provider:apn.Provider = null;
    private appleBundleId:string;
    private appKey:string;
    private options:any;
    
    
    constructor()
    {
        let debug = Nexus.settings.DEBUG_MODE == 'true';

        if(Nexus.settings.APN_KEY_ID == null || Nexus.settings.APN_KEY_ID.length <= 0)
            return null;
        
        this.options = {
            token:
                {
                    key:Nexus.i.apnKeyLocation,
                    keyId:Nexus.settings.APN_KEY_ID,
                    teamId:Nexus.settings.APPLE_TEAM_ID
                },
            production:!debug
        };
        
        this.appleBundleId = Nexus.settings.APPLE_BUNDLE_ID;
        this.appKey = Nexus.settings.APP_ENCRYPT_KEY;
        
        // let e = crypto.AES.encrypt("test", RESTApi.instance.appSettings.APP_ENCRYPT_KEY);
        // console.log(e.toString());
        //
        // let d = crypto.AES.decrypt(e, RESTApi.instance.appSettings.APP_ENCRYPT_KEY);
        // let t = d.toString(crypto.enc.Utf8);
        
        
        
    }
    
    public async sendPushNotification(users:Users[], message:string, title:string = "Updates from Nexus")
    {
        try
        {
      
            let now = Nexus.helpers.time.rawTimeHelper().utc(true);
            
            let isLate = now.get('hour') <= 12 || now.get('hour') >= 23;
            
            if(isLate)
                return true;
            
            if(this.provider != null)
                this.provider.shutdown();
            
            this.provider = new apn.Provider(this.options);
            
            let existingTokens = [];
            
            for(let user of users)
            {
                
                let pushId = user.pushId;
                
                if(pushId == null || pushId.length <= 0)
                    continue;
                
                //Decrypt
                let d = crypto.AES.decrypt(pushId, this.appKey);
                
                pushId = d.toString(crypto.enc.Utf8);
                
                if(existingTokens.indexOf(pushId) >= 0)
                    continue;
                
                existingTokens.push(pushId);
                
                switch (user.deviceType)
                {
                    case DEVICE_TYPE.IOS:
                        
                        let notification:apn.Notification = new apn.Notification();
                        notification.topic = this.appleBundleId;
                        notification.rawPayload = {
                          aps:{
                              alert:{
                                  body:message,
                                  title:title,
                              },
                              'content-available':1,
                              badge:1,
                              sound:'ping.aiff',
                          },
                            // data:{
                            //     0:'FROM DATA 2'
                            // }
                        };
                        
                        let res = await this.provider.send(notification, pushId);
                        
                      
                        if(res.failed.length > 0)
                        {
                            console.log('FAILED TO SEND PUSH TO USER: '+ user.id );
                            console.log(res.failed[0].response);
                        }
                        
                        break;
                    case DEVICE_TYPE.ANDROID:
                        await request({
                            uri: Nexus.settings.FIREBASE_URI,
                            json: true,
                            method: 'POST',
                            headers: {
                                "Authorization": 'key=' + Nexus.settings.FIREBASE_KEY
                            },
                            body: {
                                to: pushId,
                                notification: {
                                    body: message,
                                    title: title
                                },
                                priority: 10
                            }
                        });
                        break;
                }
            }
            this.provider.shutdown();
            this.provider = null;
            
            console.log('Attempted to send to ' + existingTokens.length);
            
            return true;
        }
        catch (e) {
            console.log(e);
            return false
        }
    }
    
    public async sendDefaultPushNotification(users:Users[], push:DEFAULT_PUSH_MESSAGES, args:string[])
    {
        try {
            let message = this.stringFormatter(push, args);
    
            await this.sendPushNotification(users, message);
            
            return true;
        }
        catch (e) {
            console.error('FAILED TO SEND DEFAULT PUSH '+ e.message);
            return false;
        }
    }
    
    public async registerUserForPush(user:Users, deviceId:string)
    {
        try
        {
            
            user.pushId = crypto.AES.encrypt(deviceId, this.appKey).toString();
            
            await Users.save(user);
            
            return true;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
    
    private stringFormatter(mainString:string, args:string[])
    {
        let finalString = mainString;
        
        for(let i = 0; i < args.length; i++)
        {
            let arg = args[i];
            
            finalString = finalString.replace('{'+i+'}', arg);
        }
        return finalString;
    }
    
}