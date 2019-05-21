import * as chalk from 'chalk';

export class Logger
{
    public static LogMessage(message:string, color:string)
    {
        console.log(this.stringToColor(color)(message));
    }
    private static stringToColor(color:string) : any
    {
        let colorReturn = chalk['white'];

        switch (color.toLowerCase())
        {
            case 'red':
                return chalk['red'];
        }

        return colorReturn;
    }
}