
import {getConnection} from "typeorm";
import {TestDb} from "../models/TestDb";
import {DbDefaultsBase} from "../../core/utils/DbDefaultsBase";

export class TestDbDefaults extends DbDefaultsBase
{
    private update:boolean = false;
    
    private tests= [
        {
            name:'User Firstname'
        },
        {
            name:'User Lastname'
        }
    ];
    
    protected async init()
    {
        //Are there already values?
        let testLength = await getConnection().getRepository(TestDb).find();
        this.update = testLength.length > this.tests.length;
        
    }
    protected async run()
    {
        // if(!this.continue)
        //     return;
        
        for(let i = 0; i < this.tests.length; i++)
        {
            let test = this.tests[i];
            let inDb = await getConnection().getRepository(TestDb).findOne({name:test.name});
            if(inDb == null)
                await getConnection().getRepository(TestDb).save(test);
            
        }
        
        //this.connection.save(this.types);
        
    }
    protected async end()
    {
        if(this.update)
        {
            console.log('Completed adding new Tests!')
        }
        else
            console.log('Completed Tests!');
    }
}