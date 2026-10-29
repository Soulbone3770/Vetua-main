import AuthContext from '../components/AuthContext.tsx';
import {useContext} from "react";

const useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("El contexto no existe o es undefined")
    }

    return context;
};

export default useAuth;