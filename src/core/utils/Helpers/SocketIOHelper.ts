import SocketIO = require("socket.io");

export class ConnectedUser
{
    constructor(socketId, username)
    {
        this.socketId = socketId;
    }
    socketId:string;
}
export class SocketIOHelper
{
    public namespaces:string[] = ['/'];
    public connectedUsers:ConnectedUser[] = [];
    public io:SocketIO.Server;

    public emitToAll(eventName, data)
    {
        this.namespaces.forEach(namespace =>{
           this.io.of(namespace).emit(eventName, data);
        });
    }
    public sendToUser(event:string, data:any)
    {
        this.connectedUsers.forEach(user =>{
            return this.io.to(user.socketId).emit(event, data);
        });
    }
}