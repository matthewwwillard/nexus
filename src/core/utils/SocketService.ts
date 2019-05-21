import {SioNamespaceOptions} from "./SocketDecorators";
import * as SocketController from '../utils/SocketDecorators';

export class SocketService
{
    public baseRoute(options:SioNamespaceOptions)
    {
        return SocketController.SioNamespace(options);
    }
    public event()
    {
        return SocketController.SioEvent();
    }
}