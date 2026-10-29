import {useCallback, useEffect, useState} from "react";
import type {UserDataType} from "../types/DataType.ts";
import type {ClinicaUserType} from "../types/ClinicaUserType.ts";

const API_URL = import.meta.env.VITE_API_URL;

const useGetUser = () => {

    const[user, setUser] = useState<ClinicaUserType | null>(null);
    const[loading, setLoading] = useState(false);

    const getUser = useCallback(async() => {

        setLoading(true);

        const res: Response = await fetch(`${API_URL}/users/api/getUser`, {
            credentials: "include"
        });

        const data: UserDataType = await res.json();

        if(data.mensaje){
            alert(data.mensaje);
            setLoading(false);
            return
        }

        if(!data.ok){
            alert(data.error);
            setLoading(false);
            return
        } else if(data.userClinica){
            setUser(data.userClinica);
            setLoading(false);
        }

    },[]);

    useEffect(() => {
   
        getUser();
    },[getUser]);

    return { user, getUser, loading };

};

export default useGetUser;