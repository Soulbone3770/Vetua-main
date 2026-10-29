import 'express';
import type{RolType} from 'src/types/RolType.js';

declare global{
    namespace Express{
        interface Request{
            userId?: number;
            userRol?: RolType;
        }
    }
}
export {};