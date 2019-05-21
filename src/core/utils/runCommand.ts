import * as cluster from 'cluster';
import * as os from 'os';
import {Nexus} from "../Nexus";

if(cluster.isMaster)
{
    console.log('Commander is now running a command!');
    
    var dbInit = new Nexus(process.env.REST_API_PORT, '', '',process.env, 1, true);
    
    dbInit.init_db().then(
        ()=>{
            for(var i in os.cpus())
            {
                cluster.fork();
            }
            cluster.on('exit', function(worker){
                console.log('Worker died! ' + worker.id);
                cluster.fork();
            });
        },
        (err)=>{
            console.log(err.message);
            process.exit(1);
        }
    ).catch((err)=>{
        console.log(err.message);
        process.exit(1);
    })
    
    
}
else
    var api = new Nexus(process.env.REST_API_PORT, '', '', process.env, cluster.worker.id);

