import {BaseEntity, Connection, Entity, EntitySchema, getConnection, ObjectType, Repository} from "typeorm";

export interface PaginatorSettings
{
    perPage:number;
    currentPage:number;
    toPage:number;
    orderBy?:{colum:string, direction:string}
    where?:any
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
    public static async PaginateTable(table:ObjectType<any>, relations:string[], where:{}, settings:PaginatorSettings, order:any = {id:"DESC"}) : Promise<{totalCount:number, results:any[]}>
    {
        let [results, count] = await getConnection().getRepository(table).findAndCount(
            {
                where:where,
                relations:relations,
                skip:(settings.toPage-1) * settings.perPage,
                take:settings.perPage,
                order: order
            }
        );
        
        return {totalCount:count, results:results};
    }
    public static async PaginateTableAdvanced(table:{table:ObjectType<any>, alias:string}, relations:{key:string, alias:string}[], where:{condition:string, and:boolean, args:any}[], settings:PaginatorSettings, order:any) : Promise<{totalCount:number, results:any[]}>
    {
        
        let q = await getConnection().getRepository(table.table).createQueryBuilder(table.alias);
        
        for(let r of relations)
        {
            q.leftJoinAndSelect(r.key, r.alias);
        }
        
        for(let w of where)
        {
            if(w.and)
            {
                q.andWhere(w.condition, w.args);
            }
            else
            {
                q.orWhere(w.condition, w.args);
            }
        }
        
        if(order != null)
        {
            q.orderBy(order)
        }
        
        q.take(settings.perPage);
        q.skip((settings.toPage-1) * settings.perPage);
        
        let [results, count] = await q.getManyAndCount();
        
        return {totalCount:count, results:results};
    }
}