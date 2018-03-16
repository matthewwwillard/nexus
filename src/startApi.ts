import {RESTApi} from './core/RestAPI';
import * as cluster from 'cluster';
import * as os from 'os';

require('dotenv').config({path:__dirname + '/../.env'});

// var api = new RESTApi(process.env.REST_API_PORT, '', '', process.env, 0);

// require('dotenv').config({path:__dirname + '/../.env'});
if(cluster.isMaster)
{
    var dbInit = new RESTApi(process.env.REST_API_PORT, '', '',process.env, 1, true);

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
    )


}
else
    var api = new RESTApi(process.env.REST_API_PORT, '', '', process.env, cluster.worker.id);
