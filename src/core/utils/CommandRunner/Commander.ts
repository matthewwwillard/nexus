import {BaseCommandEntity} from "./BaseCommandEntity";

export class Commander
{
    public async runCommand(command:BaseCommandEntity)
    {
        console.log('RUNNING ' + command.commandName);
        await command.init();
        await command.run();
        await command.complete();
        console.log('COMPLETED RUNNING ' + command.commandName);
    }
}