import { OpenApiType } from '../type.ts';
import { getStructNameZod } from '../refName.ts';
import { assertNever } from "@reactive/utils";

const addOptionalAndNullable = (require: boolean, nullable: boolean, typeParam: string): string => {
    const paramsArray = [typeParam];
    if (!require) {
        paramsArray.push('.optional()');
    }
    if (nullable) {
        paramsArray.push('.nullable()');
    }
    return paramsArray.join('');
};

export const generateIdent = (ident: number): string => ' '.repeat(ident);

const isFirstLetter = (param: string): boolean => {
    // Check if the parameter is of type string and is not empty
    if (param.length === 0) {
        return false;
    }

    // Retrieve the Unicode code of the first character
    const firstCharCode = param.charCodeAt(0);

    // Check if the Unicode code belongs to the range of letters
    return (firstCharCode >= 65 && firstCharCode <= 90) || (firstCharCode >= 97 && firstCharCode <= 122);
};
  
const generateObjectPropName = (key: string): string => {
    const first = key[0];

    if (first === undefined) {
        throw Error('the property name of the object must be a non-empty string');
    } else {
        if (isFirstLetter(first)) {
            return key;
        } else {
            return `'${key}'`;
        }
    }
};

export const renderType = (ident: number, data: OpenApiType): string => {
    const right = '}';

    switch (data.type) {
        case 'boolean': {
            return addOptionalAndNullable(data.required, data.nullable, 'z.boolean()');
        }
        case 'number': {
            return addOptionalAndNullable(data.required, data.nullable, 'z.number()');
        }
        case 'string': {
            return addOptionalAndNullable(data.required, data.nullable, 'z.string()');
        }
        case 'literal': {
            return addOptionalAndNullable(data.required, data.nullable, `z.literal('${data.const}')`);
        }
        case 'array': {
            return addOptionalAndNullable(data.required, data.nullable, `z.array(${renderType(ident, data.items)})`);
        }
        case 'record': {
            return addOptionalAndNullable(data.required, data.nullable, `z.record(z.string(), ${renderType(ident, data.item)})`);
        }
        case 'unknown': {
            return 'z.unknown()';
        }
        case 'tuple': {
            const result = [];

            for (const listItem of data.list) {
                result.push(renderType(0, listItem));
            }
            return addOptionalAndNullable(data.required, data.nullable,`z.tuple([${result.join(', ')}])`);
        }
        case 'union': {
            const result = [];
            for (const listItem of data.list) {
                result.push(renderType(ident, listItem));
            }
            return addOptionalAndNullable(data.required, data.nullable,`z.union([${result.join(', ')}])`);
        }

        case 'object': {
            const nextIdent = ident + 4;
            const out = [];

            out.push('z.object({');

            for (const [name, value] of Object.entries(data.props)) {
                const identStr = generateIdent(nextIdent);
                const valueStd = renderType(nextIdent, value);
                const key = generateObjectPropName(name);
                out.push(`${identStr}${key}: ${valueStd},`);
            }

            const endIden = generateIdent(ident);
            out.push(`${endIden}${right})`);

            return addOptionalAndNullable(data.required, data.nullable, out.join('\n'));
        }

        case 'ref': {
            return addOptionalAndNullable(data.required, false, getStructNameZod(data.path));
        }

        case 'null': {
            return addOptionalAndNullable(data.required, false, 'z.null()');
        }
    }

    return assertNever(data);
};
