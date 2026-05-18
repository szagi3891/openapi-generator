import { EndpointSpecType } from '../type.ts';
import { renderType } from './renderType.ts';

export const renderResponse = (endpoint: EndpointSpecType, url: string, method: string): string => {
    const out: string[] = [];

    out.push(`const checkResponse = <A>(code: number, decoder: z.ZodType<A>, data: unknown): A => {`);
    out.push('    const decodeResult = decoder.safeParse(data);');
    out.push(`    if (decodeResult.success) {`);
    out.push('        return decodeResult.data;');
    out.push(`    }`);
    out.push('    console.error(\'error details\', {');
    out.push('        errors: decodeResult.error.issues,');
    out.push('        data');
    out.push('    });');
    out.push(`    throw Error(\`Response decoding error ${url} -> ${method} -> \${code}\`);`);
    out.push(`};`);
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

