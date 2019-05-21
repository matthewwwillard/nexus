import {BaseEngineCalls} from "../BaseEngineCalls";
import * as fs from 'fs-extra';
import * as path from 'path';
import {blob} from "aws-sdk/clients/codecommit";
import {sioEventProp} from "../../../SocketDecorators";
var sizeOf = require('image-size');

export default class LocalEngine extends BaseEngineCalls
{
    constructor(config:object)
    {
        super(config);
        this.init();
    }
    private async toBase64(filePath:string)
    {
        return await Buffer.from(fs.readFileSync(filePath)).toString('base64');
    }
    private async fromBase64(data:any, filepath:any)
    {
        return await fs.outputFileSync(this.myConfigs.uploadDir + filepath, Buffer.from(data, 'base64'));
    }
    protected async init()
    {
        //generate our upload dir
        try {
            if (!fs.existsSync(this.myConfigs.uploadDir)) {
                fs.mkdirSync(this.myConfigs.uploadDir);
            }

        }
        catch(err)
        {
            console.log('TOY BROKE : ' + err.message);
        }
        return;
    }
    public async localPath()
    {
        return this.myConfigs.uploadDir;
    }
    public async get (filename:string)
    {
        return await new Promise<any>((resolve, reject)=>{
            try
            {
                if(!fs.existsSync(this.myConfigs.uploadDir + filename))
                    return reject("Can't find file : " + this.myConfigs.uploadDir + filename);
                return resolve(this.toBase64(this.myConfigs.uploadDir + filename));
            }
            catch (err)
            {
                reject(err.message);
            }
        });
    }
    public async set(source:any, filePath:string)
    {
        return await new Promise<{error:boolean, message:string, url:string, sizes:any}>(async (resolve, reject)=>{
            try
            {
                let file = this.myConfigs.localImageURI + filePath;
                await this.fromBase64(source, filePath);
                
                let sizes = await sizeOf(this.myConfigs.uploadDir + filePath);

                return resolve({error:false, message:'', url:file, sizes:sizes});
            }
            catch (err)
            {
                reject({error:true, message:err.message, url:null, sizes:null});
            }
        });
    }
    public async delete()
    {
        return await new Promise<any>((resolve, reject)=>{
            try
            {

            }
            catch (err)
            {
                reject(err.message);
            }
        });
    }
}