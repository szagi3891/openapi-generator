import { z } from '../../lib.ts';
import { EndpointSpecType, JSONValue } from '../type.ts';
import { parseType, setRequired } from '../parseType.ts';


const ParametersZod = z.array(z.object({
    in: z.enum(['path', 'query', 'header']),
    name: z.string(),
    required: z.boolean().optional(),
    schema: z.unknown(),    
})).optional();


export const convertParameters = (rawSpec: JSONValue, parameters: Array<unknown>): EndpointSpecType['parameters'] => {
    const safeParameters = ParametersZod.parse(parameters);

    const result = [];

    if (typeof safeParameters !== 'undefined') {
        for (const param of safeParameters) {
            const required = param.required ?? false;
            const schema = setRequired(parseType(rawSpec, param.schema), required);

            result.push({
                in: param.in,
                name: param.name,
                schema
            });
        }
    }

    return result;
};

