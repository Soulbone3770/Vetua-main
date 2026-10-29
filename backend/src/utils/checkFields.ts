import type {Request, Response, NextFunction} from 'express';

const checkFields = (fields: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for(const field of fields){
            if(!req.body[field]){
                return res.json({
                    mensaje: "Todos los campos son necesarioss"
                });
            }
        }

        next();
    }
};

export default checkFields;