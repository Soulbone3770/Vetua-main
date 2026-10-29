import type {TipoDocumentoType} from './TipoDocumentoType.ts';
import type {SexoType} from './SexoType.ts';

export interface ClienteType{
    id: number;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
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