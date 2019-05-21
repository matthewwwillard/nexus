
import SocketIO = require("socket.io");
import {Nexus} from "../../core/Nexus";

@Nexus.socketIo.baseRoute(
    {
        //This creates namespaces!
        name:['/'],
        //Functions to call upon connection
        onConnection:[TestSocketController.onConnection]
    }
)
export class TestSocketController
{
    public static onConnection(socket:SocketIO.Socket)
    {
        //A user has connected to the server
        socket.emit('connected', 'Hello ' + socket.id);

        Nexus.helpers.io.connectedUsers.push({socketId:socket.id});
    }
    //The name of the function is the event
    @Nexus.socketIo.event()
    public sentMessage(data:any, socket:SocketIO.Socket)
    {
        try
        {
            //Event name, Data!
            socket.emit('message', data);
        }
        catch (err)
        {
            console.log(err.message);
            socket.disconnect(true);
        }
    }
}