import type { RowDataPacket } from 'mysql2';
import type { TipoDocumentoType } from './TipoDocumentoType.js';
import type {SexoType} from "./SexoType.js";

export interface ClienteType extends RowDataPacket{
    id: number;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: Date;
    tipo_documento: TipoDocumentoType;
    num_documento: string;
    sexo: SexoType;
    telefono: string;
    correo: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    fecha_registro: Date;
}