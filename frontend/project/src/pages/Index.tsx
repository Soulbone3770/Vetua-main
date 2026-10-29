import { Link } from 'react-router-dom';
import {RutasSegunRol} from "../types/RutasSegunRol.ts";
import useAuth from '../hooks/useAuth.ts';

const Index = () => {

    //Import del contexto donde se almacenan los datos de la sesión usando el hook useAuth()
    const { rol } = useAuth();

    return (
        <div id="mainIndex">
            <Link to={RutasSegunRol[rol] ?? "/login"}><button>Acceder</button></Link>
        </div>
    );
};

export default Index;