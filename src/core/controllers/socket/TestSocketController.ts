import * as SocketController from '../../utils/SocketDecorators';
import {ConnectedUser, SocketIOHelper} from "../../utils/SocketIOHelper";
import SocketIO = require("socket.io");

@SocketController.SioNamespace(
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
    @SocketController.SioEvent()
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