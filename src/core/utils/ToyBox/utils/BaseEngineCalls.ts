/**
 * BaseEngineCalls.ts
 * - Used to define all callable functions within the toybox.
 */

export class BaseEngineCalls
{
    protected myConfigs;
    constructor(config:object)
    {
        this.myConfigs = config;
        this.init();
    }
    protected init(){}
    protected get(filename?:string) : Promise<any> { return;}
    public set(source?:any, filename?:string, dir:string = '/') : Promise<any> { return; }
    public delete(filename?:string) : Promise<any> { return; }

}