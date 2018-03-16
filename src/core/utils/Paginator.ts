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
    public static async PaginateTable(tablename, settings:PaginatorSettings)
    {

    }
}