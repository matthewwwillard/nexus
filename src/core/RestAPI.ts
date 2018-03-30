/// <reference types="socket.io" />

import {SocketIOHelper} from "./utils/SocketIOHelper";
import * as socketJwt from 'socketio-jwt';
import {createConnections, getConnection} from 'typeorm';
import {ExpressController} from "./utils/ExpressDecorators";
import * as controllers from './controllers';
//import * as overrideControllers from './controllers/overrides';

import * as socketControllers from './controllers/socket';
import * as express from 'express';
import * as https from 'http';
import * as fse from 'fs-extra';
import * as bodyParser from 'body-parser';
import * as socketIo from 'socket.io';
import * as socketIODecorator from './utils/SocketDecorators';
import * as path from 'path';
import {SioController} from './utils/SocketDecorators';
import {ToyBox} from './utils/ToyBox/ToyBox';
import "reflect-metadata";
import {Path} from "typescript";
import SocketIO = require("socket.io");

export class RESTApi
{
    public static instance:RESTApi;

    public appSettings;
    public toyBox:ToyBox;
    public workerId;

    private app;
    private io;

    private port:number;

    //Key Info
    private key:string;
    private cert:string;

    private server;

    private socketServer:SocketIO.Server;

    constructor(port, key, cert, appSettings, workerId, initDb = false)
    {
        this.port = port;
        this.key = key;
        this.cert = cert;
        this.app = express();
        RESTApi.instance = this;
        this.workerId = workerId;
        this.appSettings = appSettings;
        this.toyBox = new ToyBox({uploadDir: __dirname + '/localUploads'});
        if(!initDb)
            this.init_server();
    }

    private async init_server()
    {
        try
        {
            console.log(__dirname + "/db/models/*.js");

            let connection = await this.init_db(false);

            this.app.all('*', function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
                res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
                next();
            });

            //Expand Express

            this.app.use(bodyParser.urlencoded({extended:false,limit: '50mb'}));
            this.app.use(bodyParser.json({limit: '50mb'}));
            this.app.set('trust proxy', true);

            let initControllers = [];
            let initSocketControllers = [];


            //Add base classes
            for(let controller in controllers)
            {
                let c = new controllers[controller]();
                initControllers.push(c);
                ExpressController.register(this.app, c);
            }
            // //Add overwritten classes!
            // for(let oController in overrideControllers)
            // {
            //     let oc = new overrideControllers[oController]();
            //     initControllers.push(oc);
            //     web.register(this.app, oc);
            // }

            //require('express-print-routes')(this.app, './file.txt');
            this.app.use('/images', express.static(path.join(__dirname, 'localUploads')));

            this.app.all('*', function(req,res, next){

                //Preflight check! We don't want to 404 this!
                if(req.method == 'OPTIONS')
                    return next();
                res.status(404).send(req.method + ' ' + req.originalUrl + ' Does not exist');
            });

            this.server = https.createServer(this.app);




            this.socketServer = socketIo(this.server);
            // this.socketServer.use(socketJwt.authorize({
            //     secret:this.appSettings.SOCKET_KEY,
            //     handshake:true
            // }));

            //Init controllers
            for(let controller in socketControllers)
            {
                let nc = new socketControllers[controller]();
                initSocketControllers.push(nc);
            }
            console.log(initSocketControllers);
            const sioCrl = SioController.getInstance();
            sioCrl.init(this.socketServer);
            SocketIOHelper.io = this.socketServer;


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
        return await createConnections([
            {
                name:"mysql",
                type:'mysql',
                host:this.appSettings.MYSQL_DB_HOST,
                port:this.appSettings.MYSQL_DB_PORT,
                username:this.appSettings.MYSQL_DB_USER,
                password:this.appSettings.MYSQL_DB_PASSWORD,
                database:this.appSettings.MYSQL_DB_DATABASE,
                entities:[__dirname + "/db/models/*.js"],
                synchronize: sync
            },
        ]);
    }

}
