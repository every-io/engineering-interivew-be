import { NextFunction, Request, Response } from 'express';
import Ajv from "ajv"
const ajv = new Ajv()

export const addSchema = (schema: any, name: string ) => {
  ajv.addSchema(schema, name);
}

export const validate = (schema: string) => {
  const validation = ajv.getSchema(schema);
  return async (req: Request, res: Response, next: NextFunction) => {
    const valid = validation(req.body);
    if (valid) {
      next();
    } else {
      res.status(400).send(validation.errors.map(e => ({ errors: e.params, message: e.message })));
    }
  };
}
