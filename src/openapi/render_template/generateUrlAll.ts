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

    const left = '{';
    const right = '}';
    const resultStr = result.join('\n');
    const resultFormatted = `\n${resultStr}`;

    return `
    const query = ((): string => ${left}
        const query: string[] = [];

        const addParam = (param: string, value: string | string[] | number | boolean | null | undefined): void => ${left}
            if (typeof value === 'string') ${left}
                query.push(\`\$${left}param${right}=\$${left}encodeURIComponent(value)${right}\`);
                return;
            ${right}

            if (typeof value === 'number' || typeof value === 'boolean') ${left}
                query.push(\`\$${left}param${right}=\$${left}value.toString()${right}\`);
                return;
            ${right}

            if (Array.isArray(value)) ${left}
                for (const v of value) ${left}
                    query.push(\`\$${left}param${right}=\$${left}encodeURIComponent(v)${right}\`);
                ${right}
                
                return;
            ${right}
        ${right};

        ${resultFormatted}

        return query.length > 0 ? \`?\$${left}query.join('&')${right}\` : '';
    ${right})();`;
}

function generateUrlItem(urlChunk: string): string {
    const left = '{';
    const right = '}';

    const chars = urlChunk.split('');
    const first = chars[0];
    const last = chars[chars.length - 1];

    if (first === left && last === right) {
        const inner = chars.slice(1, -1).join('');
        const innerCamelCase = fixToCamelCase(inner);
        return `$${left}params.${innerCamelCase}${right}`;
    }

    return urlChunk;
}

function generateUrl(url: string): string {
    return url.split('/').map(generateUrlItem).join('/');
}


export function generateUrlAll(url: string, handler: EndpointSpecType): string {
    const left = '{';
    const right = '}';

    const queryStringParams0 = queryStringParams(handler.parameters);
    const generateUrl0 = generateUrl(url);

    return `
        ${queryStringParams0}
    const url = \`$${left}api_url${right}${generateUrl0}$${left}query${right}\`;
    `;
}
