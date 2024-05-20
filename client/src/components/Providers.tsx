import { PlayerContext } from "../hooks/usePlayerContext";
import { useEffect, useState } from "react";
import RouterProvider from "./Router";
import { gigachad } from "../assets";
import { socket } from "../socket";

import type { ClientUser } from "../../../server/src/lobby";

const Providers = () => {
    const [connected, setConnected] = useState(socket.connected);
    const [user, setUser] = useState<ClientUser>({
        pic: gigachad,
        username: '',
        id: socket.id
    });

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            setUser(prev => ({ ...prev, id: socket.id }));
            setConnected(true);
        });
        socket.on('disconnect', () => {
            setUser(prev => ({ ...prev, id: undefined }));
            setConnected(false);
        })
        return () => {
            socket.disconnect();
        }
    }, []);
    return (
        <PlayerContext.Provider value={{ user, setUser, connected }}>
            <RouterProvider />
        </PlayerContext.Provider>
    )
}

export default Providers;