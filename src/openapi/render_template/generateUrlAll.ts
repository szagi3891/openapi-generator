import { OpenApiType, EndpointSpecType } from '../type.ts';
import { fixToCamelCase } from './fixToCamelCase.ts';

function queryStringParamsOne(
    result: string[],
    nameKey: string,
    nameProp: string,
    apiType: OpenApiType
): void {
    switch (apiType.type) {
        case 'object':
            for (const [key, value] of Object.entries(apiType.props)) {
                const newNameKey = `${nameKey}[${key}]`;
                const newNameProp = `${nameProp}?.${key}`;
                queryStringParamsOne(result, newNameKey, newNameProp, value);
            }
            break;
        case 'string':
        case 'number':
        case 'boolean':
        case 'union':
        case 'array':
        case 'ref':
            result.push(`        addParam('${nameKey}', ${nameProp});`);
            break;
        default:
            throw Error(`Unhandled API type: ${apiType.type}`);
    }
}

function queryStringParams(parameters: EndpointSpecType['parameters']): string {
    const result: string[] = [];

    for (const param of parameters) {
        if (param.in === 'query') {
            queryStringParamsOne(
                result,
                param.name,
                `params?.${fixToCamelCase(param.name)}`,
                param.schema
            );
        }
    }

    if (result.length === 0) {
        return '\n    const query = \'\';';
    }

    const resultStr = result.join('\n');
    const resultFormatted = `\n${resultStr}`;

    return `
    const query = ((): string => {
        const searchParams = new URLSearchParams();

        const addParam = (param: string, value: string | string[] | number | boolean | null | undefined): void => {
            if (value === null || value === undefined) {
                return;
            }

            if (Array.isArray(value)) {
                for (const v of value) {
                    searchParams.append(param, v);
                }
                return;
            }

            searchParams.set(param, String(value));
        };

        ${resultFormatted}

        const q = searchParams.toString();
        return q.length > 0 ? \`?\${q}\` : '';
    })();`;
}

function generateUrlItem(urlChunk: string): string {
    const chars = urlChunk.split('');
    const first = chars[0];
    const last = chars[chars.length - 1];

    if (first === '{' && last === '}') {
        const inner = chars.slice(1, -1).join('');
        const innerCamelCase = fixToCamelCase(inner);
        return `\${params.${innerCamelCase}}`;
    }

    return urlChunk;
}

function generateUrl(url: string): string {
    return url.split('/').map(generateUrlItem).join('/');
}


export function generateUrlAll(url: string, handler: EndpointSpecType): string {
    const queryStringParams0 = queryStringParams(handler.parameters);
    const generateUrl0 = generateUrl(url);

    return `
        ${queryStringParams0}
    const url = \`\${api_url}${generateUrl0}\${query}\`;
    `;
}
