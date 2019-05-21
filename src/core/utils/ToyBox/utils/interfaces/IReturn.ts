import {IFile} from "./IFile";

export interface IReturn
{
    message:string;
    success:boolean;
    fileData:IFile;
}