import { EndpointSpecType } from '../type.ts';
import { generateIdent, renderType } from './renderType.ts';
import { fixToCamelCase } from './fixToCamelCase.ts';

export const renderParamsTypeZod = (endpoint: EndpointSpecType): string => {
    const out: string[] = [];

    for (const param of endpoint.parameters) {
        if (param.in === 'path' || param.in === 'query' || param.in === 'body') {
            
            const out1 = generateIdent(4);
            const out2 = fixToCamelCase(param.name);
            const out3 = renderType(4, param.schema);
            out.push(`${out1}${out2}: ${out3},`);
        }
    }

    const resultDef = [
        'export const ParamsTypeZOD = z.object({',
        ...out,
        '});',
        'export type ParamsType = z.TypeOf<typeof ParamsTypeZOD>;'
    ];

    return resultDef.join('\n');
};
