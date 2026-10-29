import useForm from "../hooks/useForm.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import useGetVacunas from "../hooks/useGetVacunas.ts";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import React from "react";
import {CAMPO, Pagina, SelectField} from "../components/FormUI.tsx";
import Input from "../components/Input.tsx";
import useRegistrarVacuna from "../hooks/useRegistrarVacuna.ts";
import useAuth from "../hooks/useAuth.ts";

const VeterinarioVacunacionesPage = () => {

    const { valores, handleOnChange, resetForm } = useForm({"fecha_aplicacion": "", "proxima_dosis": "", "mascota_id": 0, "vacuna_id": 0});
    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { vacunas, noVacunas, getVacunas } = useGetVacunas();
    const { mensaje, registrarVacuna } = useRegistrarVacuna();
    const { rol } = useAuth();

    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);

    const renderAgregarVacuna = () => {
        return (
            <form onSubmit={(e) => {e.preventDefault(); registrarVacuna({valores: valores}); resetForm()}}>
                <div>
                    {noMascotas !== ""
                        ? <p className="text-sm text-red-500">{noMascotas}</p>
                        : mascotas.length > 0 &&
                        <SelectField name="mascota_id" label="Selecciona una mascota" value={valores.mascota_id} onChange={handleOnChange}>
                            <option value="">Selecciona la mascota</option>
                            {mascotas.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </SelectField>
                    }
                </div>
                <div>
                    {noVacunas !== ""
                        ? <p>{noVacunas}</p>
                        : vacunas.length > 0 &&
                        <SelectField name="vacuna_id" label="Selecciona una vacuna" value={valores.vacuna_id} onChange={handleOnChange} >
                                <option value="">Selecciona la vacuna</option>
                                {vacunas.map(v => (
                                    <option key={v.id} value={v.id}>{v.nombre}</option>
                                ))}
                        </SelectField>
                    }
                </div>
                <Input label="Fecha de la aplicación" name="fecha_aplicacion" type="date" value={valores.fecha_aplicacion} onChange={handleOnChange} />
                <Input label="Fecha de la próxima dosis" name="proxima_dosis" type="date" value={valores.proxima_dosis} onChange={handleOnChange} />
                {mensaje !== "" && <p>{mensaje}</p>}
                <button type="submit">Registrar vacuna</button>
            </form>
        )
    }

    return (
        <Pagina titulo="Registrar vacuna" ancho="max-w-3xl" rolLabel={rol} volverA={"/veterinarioPage"}>
            <form
                onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    getCliente(); getMascotas(); getVacunas()
                }}
            >
                <p className="mb-1 text-sm font-bold text-black">Introduzca el número y tipo de documento del cliente</p>
                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        name="clienteTipoDocumento"
                        aria-label="Tipo de documento"
                        value={valoresDocumento.clienteTipoDocumento}
                        onChange={handleDocumentos}
                        className={`${CAMPO} md:w-40`}
                    >
                        <option value="">Tipo</option>
                        {TIPO_DOCUMENTOS.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <input
                        name="clienteNumDocumento"
                        type="text"
                        aria-label="Número de documento"
                        placeholder="Número de documento"
                        value={valoresDocumento.clienteNumDocumento}
                        onChange={handleDocumentos}
                        className={`${CAMPO} flex-1`}
                    />
                    <button type="submit" className="rounded-2xl bg-[#4C00C8] px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-[#3b009c]">
                        Buscar cliente
                    </button>
                </div>
            </form>

            {noCliente !== ""
                ? <p className="text-sm font-medium text-red-500">{noCliente}</p>
                : cliente !== undefined && renderAgregarVacuna()
            }
        </Pagina>
    )
};


export default VeterinarioVacunacionesPage;