/// <reference types="socket.io" />
import * as path from "path";
import * as fse from 'fs-extra';
import {SioController} from "./utils/SocketDecorators";
import * as socketJwt from 'socketio-jwt';
import * as socketIo from 'socket.io';
import {Nexus} from "./Nexus";

export class NexusSocket
{
    private socketServer;
    private server;
    constructor(server)
    {
        this.server = server;
    }
    async init_socketServer()
    {
        let initSocketControllers = [];
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
        Nexus.helpers.io.io = this.socketServer;
    }
}
