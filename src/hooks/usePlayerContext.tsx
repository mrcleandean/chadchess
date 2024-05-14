import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { ClientUser } from "../server/src/lobby";



export type ContextType = {
    user: ClientUser,
    setUser: Dispatch<SetStateAction<ClientUser>>,
    connected: boolean
}

export const PlayerContext = createContext<ContextType | undefined>(undefined);

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayerContext must be used within a PlayerContextProvider");
    }
    return context;

}



export default usePlayerContext;