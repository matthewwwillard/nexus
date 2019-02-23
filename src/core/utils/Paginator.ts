import {BaseEntity, Connection, Entity, EntitySchema, getConnection, ObjectType, Repository} from "typeorm";

export interface PaginatorSettings
{
    perPage:number;
    currentPage:number;
    toPage:number;
}
export class PaginatorObject
{
    currentPage:number;
    allPages:number;
    viewData:any[] = [];
    allData:any[];
    hasError:boolean = false;
    errMessage:string;

}
export class Paginator
{
    public static async PaginateData(data:any[], settings:PaginatorSettings)
    {
        let paginatorObject:PaginatorObject = new PaginatorObject();
        try
        {
            let direction = 1;

            if(settings.toPage < settings.currentPage)
                direction = -1;

            let from = settings.currentPage * settings.perPage;
            let to = from + (settings.perPage * direction);

            paginatorObject.allPages = Math.round(data.length / settings.perPage);
            paginatorObject.allData = data;
            paginatorObject.currentPage = settings.currentPage + direction;

            if(from < to)
                for(let i = from; i < (data.length > to ? to : data.length); i++)
                {
                    paginatorObject.viewData.push(data[i]);
                }
            else
                for(let i = to; i < (data.length - settings.perPage > 0 ? from : 0); i++)
                {
                    paginatorObject.viewData.push(data[i]);
                }

        }
        catch (err)
        {
            paginatorObject = new PaginatorObject();
            paginatorObject.hasError = true;
            paginatorObject.errMessage = err.message;
        }
        return paginatorObject;
    }
    public static async PaginateTable(table:ObjectType<any>, relations:string[], where:{}, settings:PaginatorSettings) : Promise<{totalCount:number, results:any[]}>
    {
        let direction = 1;

        if(settings.toPage < settings.currentPage)
            direction = -1;
        
        let from = settings.currentPage * settings.perPage;
        let to = from + (settings.perPage * direction);
    
        if(settings.toPage == 1)
        {
            from = 0;
            to = settings.perPage;
        }

        console.log(from, to);
        
        let count = await getConnection().getRepository(table).count(
            {
                where:where
            }
        );
        
        let results = await getConnection().getRepository(table).find(
            {
                where:where,
                relations:relations,
                skip:from,
                take:to
            }
        );

        return {totalCount:count, results:results};
    }
}