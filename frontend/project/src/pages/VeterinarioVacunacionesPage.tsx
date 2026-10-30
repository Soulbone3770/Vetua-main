import useForm from "../hooks/useForm.ts";
import {TIPO_DOCUMENTOS, type TipoDocumentoType} from "../types/TipoDocumentoType.ts";
import useGetVacunas from "../hooks/useGetVacunas.ts";
import useGetMascotas from "../hooks/useGetMascotas.ts";
import useGetCliente from "../hooks/useGetCliente.ts";
import { Pagina, FormCard, SelectField, BuscadorDocumento, MensajeError, BOTON_PRINCIPAL } from "../components/FormUI.tsx";
import Input from "../components/Input.tsx";
import useRegistrarVacuna from "../hooks/useRegistrarVacuna.ts";

const VeterinarioVacunacionesPage = () => {

    const { valores, handleOnChange, resetForm } = useForm({"fecha_aplicacion": "", "proxima_dosis": "", "mascota_id": 0, "vacuna_id": 0});
    const { valores: valoresDocumento, handleOnChange: handleDocumentos } = useForm({"clienteNumDocumento": "", "clienteTipoDocumento": "" as TipoDocumentoType});
    const { cliente, noCliente, getCliente } = useGetCliente(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);
    const { vacunas, noVacunas, getVacunas } = useGetVacunas();
    const { mensaje, registrarVacuna } = useRegistrarVacuna();

    const { mascotas, noMascotas, getMascotas } = useGetMascotas(valoresDocumento.clienteNumDocumento, valoresDocumento.clienteTipoDocumento);

    const renderAgregarVacuna = () => {
        return (
            <form onSubmit={(e) => {e.preventDefault(); registrarVacuna({valores: valores}); resetForm()}}>
                <FormCard titulo="Registrar vacuna">
                    <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        <div>
                            {noMascotas !== ""
                                ? <MensajeError texto={noMascotas} />
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
                                ? <MensajeError texto={noVacunas} />
                                : vacunas.length > 0 &&
                                <SelectField name="vacuna_id" label="Selecciona una vacuna" value={valores.vacuna_id} onChange={handleOnChange}>
                                    <option value="">Selecciona la vacuna</option>
                                    {vacunas.map(v => (
                                        <option key={v.id} value={v.id}>{v.nombre}</option>
                                    ))}
                                </SelectField>
                            }
                        </div>
                        <Input label="Fecha de la aplicación" name="fecha_aplicacion" type="date" value={valores.fecha_aplicacion} onChange={handleOnChange} />
                        <Input label="Fecha de la próxima dosis" name="proxima_dosis" type="date" value={valores.proxima_dosis} onChange={handleOnChange} />
                    </div>
                </FormCard>
                {mensaje !== "" && <div className="mt-4"><MensajeError texto={mensaje} /></div>}
                <button type="submit" className={`${BOTON_PRINCIPAL} mt-6`}>Registrar vacuna →</button>
            </form>
        )
    }

    return (
        <Pagina titulo="Registrar vacuna" ancho="max-w-3xl" rolLabel="Veterinario" volverA="/veterinarioPage">
            <BuscadorDocumento
                tipo={valoresDocumento.clienteTipoDocumento}
                numero={valoresDocumento.clienteNumDocumento}
                onChange={handleDocumentos}
                onSubmit={() => { getCliente(); getMascotas(); getVacunas(); }}
                opciones={TIPO_DOCUMENTOS}
            />
            {noCliente !== ""
                ? <MensajeError texto={noCliente} />
                : cliente !== undefined && renderAgregarVacuna()
            }
        </Pagina>
    )
};

export default VeterinarioVacunacionesPage;