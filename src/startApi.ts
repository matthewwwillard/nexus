import {Nexus} from './core/Nexus';
import * as cluster from 'cluster';
import * as sticky from 'sticky-session';
import * as os from 'os';

require('dotenv').config({path:__dirname + '/../.env'});
const port = process.env.REST_API_PORT;
const useCluster = process.env.DISABLE_CLUSTER_MODE == 'false';

if(useCluster) {
    if (cluster.isMaster) {
        var dbInit = new Nexus(port, '', '', process.env, 1);

        dbInit.init_db().then(
            () => {
                dbInit.init_server().then((server) => {
                    server.listen(port, ()=>{
                        console.log('Master Server started');
                    });

                    for (var i in os.cpus()) {
                        cluster.fork();
                    }
                    cluster.on('exit', function (worker) {
                        console.log('Worker died! ' + worker.id);
                        cluster.fork();
                    });

                });

            },
            (err) => {
                console.log(err.message);
                process.exit(1);
            }
        ).catch((err) => {
            console.log(err.message);
            process.exit(1);
        })


    } else {
        new Nexus(port, '', '', process.env, 1).init_server().then((server)=>{
            server.listen(port, ()=>{
                console.log('Worker Started ID: ' + cluster.worker.id);
            })
        })

    }
}
else
{
    var dbInit = new Nexus(port, '', '', process.env, 1);

    dbInit.init_db().then(
        () => {
            dbInit.init_server().then((server) => {
                if (!sticky.listen(server, port)) {
                    server.once('listening', () => {
                        console.log('Master server started');
                    });
                }
            });
        },
        (err) => {
            console.log(err.message);
            process.exit(1);
        }
    ).catch((err) => {
        console.log(err.message);
        process.exit(1);
    })
}
