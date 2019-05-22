/// <reference types="socket.io" />

import * as socketJwt from 'socketio-jwt';
import {createConnections, getConnection} from 'typeorm';
import * as express from 'express';
import * as https from 'http';
import * as fse from 'fs-extra';
import * as bodyParser from 'body-parser';
import * as publicIp from 'express-public-ip';
import * as socketIo from 'socket.io';
import * as socketIODecorator from './utils/SocketDecorators';
import * as path from 'path';
import {SioController} from './utils/SocketDecorators';
import {ToyBox} from './utils/ToyBox/ToyBox';
import "reflect-metadata";
import {HttpService} from "./utils/HttpService";
import {HelpersService} from "./utils/HelpersService";
import {SocketService} from "./utils/SocketService";

export class Nexus
{
    public static http:HttpService;
    public static socketIo:SocketService;
    public static settings;
    public static helpers:HelpersService;
    public static i:Nexus;
    
    public appleKeyBuffer:any;
    public apnKeyLocation:string;
    public workerId;

    private app;
    private io;
    private port:number;
    private key:string;
    private cert:string;
    private server;
    private socketServer;

    constructor(port, key, cert, appSettings, workerId, initDb = false)
    {
        Nexus.settings = appSettings;
        Nexus.http = new HttpService();
        Nexus.helpers = new HelpersService();
        Nexus.socketIo = new SocketService();
        Nexus.i = this;
        process.setMaxListeners(0);

        if(fse.existsSync(path.join(__dirname, '../../apple_key.p8')))
            this.appleKeyBuffer = fse.readFileSync(path.join(__dirname, '../../apple_key.p8'));
        this.apnKeyLocation = path.join(__dirname, '../../apn.p8');
        
        this.port = port;
        this.key = key;
        this.cert = cert;
        this.app = express();

        this.workerId = workerId;
        
        if(!initDb)
            this.init_server();
    }

    private async init_server()
    {
        try
        {
            let connection = await this.init_db(false);

            this.app.all('*', function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, public, private");
                res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
                next();
            });

            //Expand Express
            this.app.use(bodyParser.json({limit: '512mb'}));
            this.app.use(bodyParser.urlencoded({extended:true,limit: '512mb'}));
            this.app.set('trust proxy', true);
            this.app.use(publicIp());

            let initControllers = [];
            let initSocketControllers = [];

            const controllers = fse.readdirSync(path.join(__dirname,'../http/controllers'));

            //Add base classes
            for(let controller of controllers)
            {
                let c = require(path.join(__dirname,'../http/controllers/'+controller));
                Nexus.http.register(this.app, new c[controller.split('.')[0]]());
            }

            this.app.use('/images', express.static(path.join(__dirname, Nexus.settings.TOYBOX_DIR)));
            this.app.use('/docs', express.static(path.join(__dirname, '../../apiDocs/')));

            this.app.all('*', function(req,res, next){

                //Preflight check! We don't want to 404 this!
                if(req.method == 'OPTIONS')
                    return next();
                res.status(404).json({message:req.method + ' ' + req.originalUrl + ' Does not exist'}).send();
            });

            this.server = https.createServer(this.app);

            this.socketServer = socketIo(this.server);
            // this.socketServer.use(socketJwt.authorize({
            //     secret:this.appSettings.SOCKET_KEY,
            //     handshake:true
            // }));

            const socketControllers = fse.readdirSync(path.join(__dirname,'../socket/controllers'));

            //Add base classes
            for(let controller of socketControllers)
            {
                let c = require(path.join(__dirname,'../socket/controllers/'+controller));
                initSocketControllers.push(new c[controller.split('.')[0]]());
            }

            const sioCrl = SioController.getInstance();
            sioCrl.init(this.socketServer);
            Nexus.helpers.io = this.socketServer;


            this.server.listen(this.port, () =>
            {
                console.log('Started API Server on port: ' + this.port + ' I am worker ' + this.workerId);
            });



        }
        catch(error)
        {
            console.log(error);
            process.exit(1);
        }
    }
    public async init_db(sync = true)
    {
        if(sync)
            sync = Nexus.settings.SYNC_DB == 'true';

        let connection = await createConnections([
            {
                name:"default",
                type:'mysql',
                host:Nexus.settings.MYSQL_DB_HOST,
                port:Nexus.settings.MYSQL_DB_PORT,
                username:Nexus.settings.MYSQL_DB_USER,
                password:Nexus.settings.MYSQL_DB_PASSWORD,
                database:Nexus.settings.MYSQL_DB_DATABASE,
                entities:[__dirname + "/../db/models/*.js"],
                synchronize: sync,
                logging:false
            }
        ]);

        if(sync) {
            console.log('Initializing Defaults');

            const dbDefaults = fse.readdirSync(path.join(__dirname,'../db/defaults'));

            //Add base classes
            for(let controller of dbDefaults)
            {
                let c = require(path.join(__dirname,'../db/defaults/'+controller));
                let d = new c[controller.split('.')[0]]();

                await d.init();
                await d.run();
                await d.end();
            }

        }
        return connection;
    }

}
