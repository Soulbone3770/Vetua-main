import {useEffect, useState} from "react";

interface Props<T extends object>{
    criterioBusqueda: keyof T;
    arrayBusqueda: T[];
}

const useBarraBusqueda = <T extends object>({criterioBusqueda, arrayBusqueda}: Props<T>) => {

    const[array, setArray] = useState(arrayBusqueda);
    const[valor, setValor] = useState("");

    const realizarBusqueda = (valor: string) => {
        if(valor === ""){
            setArray(arrayBusqueda);
            return
        }

        const newArray = arrayBusqueda.filter(o => String(o[criterioBusqueda]).toLowerCase().startsWith(valor.toLowerCase()));
        setArray(newArray);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setArray(arrayBusqueda);
    },[arrayBusqueda]);

    const renderBarra = () => {
        return (
            <div>
                <form onSubmit={(e) => {e.preventDefault(); realizarBusqueda(valor)}}>
                    <input value={valor} onChange={(e) => setValor(e.target.value)}/>
                    <button type="submit">Buscar</button>
                </form>
            </div>
        );
    };

    return { array, renderBarra }

};

export default useBarraBusqueda;