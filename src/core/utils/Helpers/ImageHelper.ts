import * as ei from 'easyimage';
import * as fs from 'fs-extra';
import {BaseEngineCalls} from "../ToyBox/utils/BaseEngineCalls";
import {Nexus} from "../../Nexus";
import {Images} from "../../../db/models/Images";

export class ImageHelper
{
    private toyBox:BaseEngineCalls;

    public async reduceImageSize(imageName:string, imageData:string) : Promise<string>
    {
        this.toyBox = Nexus.helpers.toyBox.engine('local');

        let tmp = Nexus.helpers.auth.uuid();
        
        let imageNameHolder = `/converter/${tmp}-${imageName}`;
        
        //Save the image to the converter area
        await this.toyBox.set(imageData,imageNameHolder);
        
        //Start conversion
        let res = await ei.resize({
            src:await this.toyBox.localPath() + imageNameHolder,
            width:1024,
            onlyDownscale:true,
            quality:100
        });
        
        let returnData = Buffer.from(fs.readFileSync(res.path)).toString('base64');
        
        await fs.removeSync(res.path);
        
        let local = await this.toyBox.localPath();
        
        await fs.removeSync(`${local}/converter`);
        
        return returnData;
    }
    
    public async saveImage(imgName:string, data:string) : Promise<Images>
    {
        let toyBox = Nexus.helpers.toyBox.engine(Nexus.settings.TOYBOX_DEFAULT_ENGINE);
        
        let url = await toyBox.set(data, imgName);
        
        if(url.error)
        {
            console.error('Error saving image!! ' + url.message);
            return null;
        }
        
        let imageData = new Images();
        imageData.url = url.url;
        imageData.engine = Nexus.settings.TOYBOX_DEFAULT_ENGINE.toLowerCase();
        imageData.size = 0;
        imageData.width = url.sizes.width;
        imageData.height = url.sizes.height;
        
        return imageData;
    }

    public async removeImage(imageId:string) : Promise<boolean>
    {
        return false;
    }
}