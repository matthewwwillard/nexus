import * as socketIo from 'sio-tsd';
import {ConnectedUser, SocketIOHelper} from "../../utils/SocketIOHelper";

@socketIo.SioNamespace(
    {
        //This creates namespaces!
        name:['/'],
        //Functions to call upon connection
        onConnection:[TestSocketController.onConnection]
    }
)
export default class TestSocketController
{
    public static onConnection(socket:SocketIO.Socket)
    {
        //A user has connected to the server
        socket.emit('connected', 'Hello ' + socket.id);

        SocketIOHelper.connectedUsers.push({socketId:socket.id});
    }
    //The name of the function is the event
    @socketIo.SioEvent()
    public ping(data:any, socket:SocketIO.Socket)
    {
        try
        {
            //Event name, Data!
            socket.emit('pong', 'pong');
        }
        catch (err)
        {
            console.log(err.message);
            socket.disconnect(true);
        }
    }
}