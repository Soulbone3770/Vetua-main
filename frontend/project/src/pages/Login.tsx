import useForm from '../hooks/useForm.ts';
import Input from '../components/Input.tsx';
import React, {useEffect, useState} from 'react';
import type { DataType } from '../types/DataType.ts';
import { useNavigate } from 'react-router-dom';
import {ROLES, rolesObjeto} from "../types/Roles.ts";
import { RutasSegunRol } from "../types/RutasSegunRol.ts";
import useAuth from '../hooks/useAuth.ts';

const Login = () => {
    const navigate = useNavigate();
    const { authCheck, rol } = useAuth();

    const rolesValidos = Object.values(rolesObjeto);

    useEffect(() => {
        if(rolesValidos.includes(rol)){
            navigate(`${RutasSegunRol[rol]}`)
        }
    }, [navigate, rol, rolesValidos]);

    const { valores, handleOnChange, resetForm } = useForm({
        "username": "",
        "password": "",
        "rol": "",
        "clinicaNombre": "",
        "recuerdame": false
    });
    const [mensaje, setMensaje] = useState("");

    const loginProcess = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje("");

        // Ruta enviada a través del proxy configurado en Vite
        const url = "http://localhost:3000/users/api/login";

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(valores)
            });

            const texto = await res.text();

            let data: DataType;
            try {
                data = JSON.parse(texto);
            } catch {
                console.error(
                    `Respuesta NO JSON de ${url} (status ${res.status}):`,
                    texto.slice(0, 300)
                );
                setMensaje(
                    `El servidor respondió ${res.status} en ${url}. Verifica que la ruta exista en tu backend.`
                );
                return;
            }

            if (!res.ok || data.error || (data.mensaje && !data.ok)) {
                const errorMsg = data.error || data.mensaje || "Ocurrió un error al iniciar sesión.";
                setMensaje(errorMsg);
                console.error(errorMsg);
                return;
            }

            if (data.rol) {
                const ruta: string = RutasSegunRol[data.rol] || "/recepcionistaPage";
                resetForm();
                await authCheck();
                navigate(ruta, { replace: true });
            } else {
                setMensaje("No se pudo determinar el rol del usuario.");
            }
        } catch (error) {
            console.error("Error en la petición de login:", error);
            setMensaje("No se pudo conectar con el servidor backend.");
        }
    };

    return (
        <div className="min-h-screen w-full m-0 p-0 flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Panel Izquierdo Morado */}
            <div 
                className="hidden md:flex md:w-1/2 p-12 lg:p-16 flex-col justify-between text-white relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/fondix.png')" }}
            >
                <div className="z-10 text-left">
                    <span className="text-sm font-light tracking-wider text-white opacity-90">Vetua</span>
                </div>
                <div className="my-auto max-w-xl z-10 text-left">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 !text-white">
                        Gestiona tus tareas con facilidad
                    </h1>
                    <p className="text-lg lg:text-xl font-light !text-white opacity-90">
                        Sistema de gestión veterinaria
                    </p>
                </div>
                <div className="text-xs text-white opacity-60 z-10 text-left">
                    Vetua System
                </div>
            </div>

            {/* Panel Derecho del Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto">
                <div className="max-w-md w-full text-left space-y-4">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold !text-black tracking-tight leading-none mb-2">
                            BIENVENIDO
                        </h2>
                        <p className="text-lg font-light !text-gray-500 opacity-80 leading-relaxed max-w-md">
                            Ingresa las credenciales que te concedieron
                        </p>
                    </div>
                    
                    <form onSubmit={loginProcess} className="space-y-3">
                        <Input 
                            type="text" 
                            name="username" 
                            label="Nombre de usuario" 
                            value={valores.username} 
                            onChange={handleOnChange} 
                        />
                        
                        <Input 
                            type="password" 
                            name="password" 
                            label="Contraseña" 
                            value={valores.password} 
                            onChange={handleOnChange} 
                        />
                        
                        <div className="text-left">
                            <label className="block text-sm font-medium text-gray-800 mb-1">
                                Rol
                            </label>
                            <select 
                                name="rol" 
                                value={valores.rol} 
                                onChange={handleOnChange}
                                className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-gray-400 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                            >
                                <option value="">Selecciona una opción</option>
                                {ROLES.map(rol => (
                                    <option key={rol} value={rolesObjeto[rol]}>{rol}</option>
                                ))}
                            </select>
                        </div>

                        <Input 
                            label="Nombre de la clínica" 
                            type="text" 
                            name="clinicaNombre" 
                            value={valores.clinicaNombre} 
                            onChange={handleOnChange} 
                        />

                        <div className="flex items-center space-x-3 pt-1">
                            <input 
                                type="checkbox" 
                                id="recuerdame"
                                name="recuerdame" 
                                checked={valores.recuerdame} 
                                onChange={handleOnChange}
                                className="h-5 w-5 accent-purple-600 border-gray-300 rounded cursor-pointer" 
                            />
                            <label htmlFor="recuerdame" className="text-sm font-normal text-gray-800 cursor-pointer">
                                Recuérdame
                            </label>
                        </div>

                        {mensaje !== "" && (
                            <p className="text-red-500 text-sm font-medium text-left">{mensaje}</p>
                        )}

                        <button 
                            type="submit"
                            className="w-full py-3.5 px-6 bg-[#4C00C8] hover:bg-[#3b009c] text-white font-medium rounded-2xl shadow-md transition duration-200 mt-2 flex items-center justify-center space-x-2 text-base"
                        >
                            <span>Inicia sesión</span>
                            <span className="text-lg">→</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;