import * as moment from 'moment';

export class TimeHelper
{
    public rawTimeHelper = moment;
    public delay = ms => new Promise(res => setTimeout(res, ms));
    
    public isGreaterThan(start:string, end:string, equal:boolean = false)
    {
        if(!equal)
            return moment(start).isAfter(moment(end));

        return moment(start).isSameOrAfter(moment(end));
    }
}
