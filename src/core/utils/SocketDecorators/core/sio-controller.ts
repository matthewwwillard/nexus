import * as SocketIO from 'socket.io';
import {Nexus} from "../../../Nexus";
export const sioEventProp = '__sioEvent';
export const sioNamespaceProp = '__sioNamespace';
export const sioRegisterConnection = '__sioConnection';

export interface SioNamespaceOptions {
  name: string | Array<string>;
  middleware?: Array<(socket: SocketIO.Socket, next: () => void) => void>;
  onConnection?: Array<(socket: SocketIO.Socket) => void>;
}

export class SioController {
  private static instance: SioController = null;

  private io: SocketIO.Server;
  private isInitialized = false;
  private ioNamespaceClasses: any[] = [];
  private ioConnectionClasses: any[] = [];  
  private namespaces: Map<string, SocketIO.Namespace> = new Map();

  static getInstance() {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
  }
  rootSocketServer()
  {
    return this.io;
  }

  addIoNamespace(namespaceClass: any) {
    if (this.isInitialized) {
      throw new Error('SioNamespace can not be added after SioController initialization.');
    }
    this.ioNamespaceClasses.push(namespaceClass);    
  
  }
  addConnectionListener(className:any) {
    if (this.isInitialized) {
      throw new Error('SioNamespace can not be added after SioController initialization.');
    }
    this.ioConnectionClasses.push(className);
  }

  init(io: SocketIO.Server) {
    if (this.isInitialized) {
      throw new Error('SioController can be initialized only once.');
    }

    this.io = io;
    this.ioNamespaceClasses.forEach(nspClass => {
        this.prepareNamespace(nspClass);
    });
    this.isInitialized = true;
  }

  private prepareNamespace(ioNamespaceClass: any) {
    const nspObj = new ioNamespaceClass();
    const nspName = nspObj.constructor[sioNamespaceProp].name;

    if(Array.isArray(nspName))
    {
      nspName.forEach(name=>{
        this.generateCallsWithNamespace(nspObj, name);
      });
    }
    else
    {
      this.generateCallsWithNamespace(nspObj, nspName);
    }
    
  }
  private generateCallsWithNamespace(nspObj:any, nspName)
  {
    let nsp = this.namespaces.get(nspName);

    if (!nsp) {
      nsp = this.io.of(nspName);
    }

    if (nspObj.constructor[sioNamespaceProp].middleware) {
      nspObj.constructor[sioNamespaceProp].middleware.forEach(cb => {
        nsp.use(cb);
      });
    }

    nsp.on('connection', (socket: SocketIO.Socket) => {
        socket.on('disconnect', ()=>{
            Nexus.helpers.io.userDisconnected(socket.id);
        });
      const onConnectionCbs = nspObj.constructor[sioNamespaceProp].onConnection;

      if (onConnectionCbs) {
        onConnectionCbs.forEach(cb => {
          cb(socket);
        });
      }

      if (nspObj.constructor[sioEventProp]) {
        nspObj.constructor[sioEventProp].forEach((event: string) => {
          socket.on(event, data => {
            nspObj[event](data, socket);
          });
        });
      }
    });

    this.namespaces.set(nspName, nsp);
  }
}
