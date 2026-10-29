import React, { useState } from 'react';

//Hook que se encarga de gestionar los formularios de la página
const useForm = <T extends object>(valoresIniciales: T) => {

    //Constante useState de los valores a gestionar
    const[valores, setValores] = useState(valoresIniciales);

    //Funcion para gestionar el onChange del formulario
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        //Si el input a gestionar el un checkbox, definimos el atributo checked en lugar de value
        if(e.target instanceof HTMLInputElement && e.target.type === "checkbox"){
            const { name, checked } = e.target;

            setValores(prev => ({
                ...prev,
                [name]: checked}));
            return;
        }

        //Si el input utiliza el atributo value, cambiamos ese atributo
        const { name, value } = e.target;
        setValores(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //Función para resetear el formulario a sus valores en blanco
    const resetForm = () => {
        setValores(valoresIniciales);
    };

    //Retornamos la constante valores y las funciones del formulario
    return { valores, handleOnChange, resetForm };

};

export default useForm;