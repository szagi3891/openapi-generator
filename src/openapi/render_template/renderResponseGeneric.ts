import { EndpointSpecType } from '../type.ts';

const hasResponse = (handler: EndpointSpecType, code: string): boolean => {
    for (const responseItem of Object.keys(handler.responses)) {
        if (responseItem === code) {
            return true;
        }
    }

    return false;
};

export const renderResponseGeneric = (nameInFileCamelcaseBig: string, handler: EndpointSpecType): [string, string] => {
    const left = '{';
    const right = '}';

    const paramChunks: string[] = [];
    const ifChunks: string[] = [];

    for (const [code, _] of Object.entries(handler.responses)) {
        paramChunks.push(`
    ${left}
        status: ${code};
        body: Response${code}Type;
    ${right}`);

        ifChunks.push(`
    if (status === ${code}) ${left}
        return ${left} status: ${code}, body: checkResponse(${code}, Response${code}ZOD, json) ${right};
    ${right}`);
    }

    const genericResponseTypes = paramChunks.join(' | ');
    const genericResponseIfs = ifChunks.join('\n');

    const template = hasResponse(handler, '200')
        ? `
export type ${nameInFileCamelcaseBig}ResponseType = ${genericResponseTypes};

export type ${nameInFileCamelcaseBig}Response200Type = Response200Type;`
        : `
export type ${nameInFileCamelcaseBig}ResponseType = ${genericResponseTypes};`;

    return [template, genericResponseIfs];
};
