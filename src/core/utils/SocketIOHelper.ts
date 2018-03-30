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
    public static namespaces:string[] = ['/'];
    public static connectedUsers:ConnectedUser[] = [];
    public static io:SocketIO.Server;

    public static emitToAll(eventName, data)
    {
        SocketIOHelper.namespaces.forEach(namespace =>{
           SocketIOHelper.io.of(namespace).emit(eventName, data);
        });
    }
    public static sendToUser(event:string, data:any)
    {
        SocketIOHelper.connectedUsers.forEach(user =>{
            return SocketIOHelper.io.to(user.socketId).emit(event, data);
        });
    }
}