import { EndpointSpecType } from '../type.ts';
import { renderType } from './renderType.ts';

export const renderResponse = (endpoint: EndpointSpecType, url: string, method: string): string => {
    const left = '{';
    const right = '}';
    const out: string[] = [];

    out.push(`const checkResponse = <A>(code: number, decoder: z.ZodType<A>, data: unknown): A => ${left}`);
    out.push('    const decodeResult = decoder.safeParse(data);');
    out.push(`    if (decodeResult.success) ${left}`);
    out.push('        return decodeResult.data;');
    out.push(`    ${right}`);
    out.push('    console.error(\'error details\', {');
    out.push('        errors: decodeResult.error.errors,');
    out.push('        data');
    out.push('    });');
    out.push(`    throw Error(\`Response decoding error ${url} -> ${method} -> $${left}code${right}\`);`);
    out.push(`${right};`);
    out.push('');
    out.push('');

    for (const [code, response] of Object.entries(endpoint.responses)) {
        const typeIO = renderType(0, response);

        out.push(`export const Response${code}ZOD = ${typeIO};`);
        out.push(`export type Response${code}Type = z.TypeOf<typeof Response${code}ZOD>;`);
        out.push('');
    }

    return out.join('\n');
};

