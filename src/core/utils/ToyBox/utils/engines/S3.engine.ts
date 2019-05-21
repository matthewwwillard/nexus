import {BaseEngineCalls} from "../BaseEngineCalls";
import * as aws from 'aws-sdk';
import S3 = require("aws-sdk/clients/s3");
var mime = require('mime-types');
import * as http from 'https';
import * as url from 'url';
import {Nexus} from "../../../../Nexus";
var sizeOf = require('image-size');
export interface AWSConfig
{
    accessKeyId:string,
    secretAccessKey:string,
    bucket:string
}

export default class S3Engine extends BaseEngineCalls
{
    
    protected s3: S3;
    protected configs:AWSConfig;
    
    constructor(config:AWSConfig)
    {
        super(config);
    }
    public async init()
    {
        this.configs = {
            accessKeyId:Nexus.settings.AWS_S3_KEY,
            secretAccessKey:Nexus.settings.AWS_S3_SECRET,
            bucket:Nexus.settings.AWS_S3_BUCKET
        }
        
        this.s3 = new aws.S3({
            accessKeyId:this.configs.accessKeyId,
            secretAccessKey:this.configs.secretAccessKey
        });
    }
    public async get (filename?:string)
    {
        return new Promise<any>((resolve, reject)=>{
        
        })
    }
    public async set(source:any, filename:string) : Promise<{error:boolean, message:string, url:string, sizes:any}>
    {
        
        try {
            
            let type = mime.lookup(filename);
            let extension = mime.extension(type);
            let saveData = new Buffer(source,'base64');
            
            filename = 'app_content' + filename.split('.')[0];
            
            let newFilename = filename + '.' + extension;
            
            let res = await new Promise<any>(async (resolve, reject) => {
                let data = {
                    Key: newFilename,
                    Bucket: this.configs.bucket,
                    Body: saveData,
                    ContentEncoding: 'base64',
                    ContentType: type,
                    ACL: 'public-read'
                };
                try {
                    await this.s3.upload(data, async (err, results) => {
                        if (err) {
                            console.log(err);
                            return reject({error:true, message:err.message, url:null, sizes:null});
                        }
                        
                            http.get(url.parse(results.Location), (response) => {
                                var chunks = [];
                                response.on('data', (chunk) => {
                                    chunks.push(chunk);
                                }).on('end', () => {
                                    var buffer = Buffer.concat(chunks);
                                    let sizes = sizeOf(buffer);
                                    return resolve({
                                        error: false,
                                        message: null,
                                        url: results.Location,
                                        sizes: sizes
                                    });
                                })
            
                            });
                        
                    });
                }
                catch (e) {
                    throw {error:true, message:e.message, url:null, sizes:null};
                }
            });
            
            return res;
        }
        catch (e) {
            return {error:true, message:e.message, url:null, sizes:null};
        }
    }
    public async delete(filename:string)
    {
        return await new Promise<any>((resolve, reject)=>{
            this.s3.deleteObject({
                Bucket: this.configs.bucket,
                Key: filename
            },(err, data)=>{
                if(err) {
                    console.error(err.message);
                    return reject(false);
                }
                return resolve(true)
            });
        })
    }
}