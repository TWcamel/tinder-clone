import React from 'react';
import io, { Socket } from 'socket.io-client';
import Config from '../../config/config';
import useLocalStorage from '../../hooks/useLocalStorage';
import AuthService from '../../services/authService';
import { toast } from 'react-toastify';
import { refreshPage } from '../../utils/page';

const SocketContext: React.Context<Socket | null> =
    React.createContext<Socket | null>(null);

export const useSocket: Function = () => React.useContext(SocketContext);

export const SocketProvider: React.FC<{
    id: string;
    children: React.ReactNode;
}> = ({ id, children }) => {
    const [socket, setSocket]: [Socket | null, Function] =
        React.useState<Socket | null>(null);

    React.useEffect(() => {
        const newSocket: Socket = io(Config.SERVER_URL, {
            query: { id },
            extraHeaders: {
                Authorization: `Bearer ${AuthService.getBearerToken()}`,
            },
        });
        setSocket(newSocket);
        newSocket.on('disconnect', () => {
            toast.info('Disconnected');
            refreshPage();
        });
        return (): any => newSocket.close();
    }, [id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
