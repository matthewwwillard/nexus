import { createConnection } from 'typeorm';
import * as web from "express-decorators";
import * as controllers from './controllers'
import express = require("express");
import https = require("http");
import * as bodyParser from 'body-parser';

export class RestAPI
{
    private app;
    private io;

    private port:number;

    //Key Info
    private key:string;
    private cert:string;

    private server;

    constructor(port, key, cert)
    {
        this.port = port;
        this.key = key;
        this.cert = cert;
        this.app = express();
        this.init_server();
    }

    private async init_server()
    {
        try
        {
            console.log(__dirname + "/db/models/*.js");
            let connection = await createConnection(
                {

                    type: "mysql",
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: 'root',
                    database: 'test',
                    entities: [
                        __dirname + "/db/models/*.js"
                    ],
                    synchronize: true
                });

            this.app.all('*', function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
                next();
            });

            //Expand Express
            this.app.use(bodyParser.urlencoded({extended:false}));
            this.app.use(bodyParser.json());

            //Init controllers
            for(let controller in controllers)
            {
                let t = new controllers[controller]();
                web.register(this.app, t);
            }

            this.app.all('*', function(req,res){
                res.status(404).send(req.method + ' ' + req.originalUrl + ' DOES NOT EXIST');
            });

            this.server = https.createServer(this.app);
            this.server.listen(this.port, () =>
            {
                console.log('Started API Server on port: ' + this.port);
            });
        }
        catch(error)
        {
            console.log('ERROR:' + error);
            process.exit(1);
        }
    }

}