import { assertNever } from "../../lib.ts";
import { OpenApiType } from '../type.ts';

const getAllRefsInner = (result: Array<string>, schema: OpenApiType): void => {

    switch (schema.type) {
        case 'unknown': {
            return;
        }

        case 'literal': {
            return;
        }

        case 'number': {
            return;
        }

        case 'string': {
            return;
        }

        case 'boolean': {
            return;
        }

        case 'null': {
            return;
        }

        case 'array': {
            getAllRefsInner(result, schema.items);
            return;
        }

        case 'ref': {
            result.push(schema.path);
            return;
        }

        case 'record': {
            getAllRefsInner(result, schema.item);
            return;
        }

        case 'object': {
            for (const propSchema of Object.values(schema.props)) {
                getAllRefsInner(result, propSchema);
            }
            return;
        }

        case 'union': {
            for (const itemSchema of schema.list) {
                getAllRefsInner(result, itemSchema);
            }
            return;
        }
        
        case 'tuple': {
            for (const itemSchema of schema.list) {
                getAllRefsInner(result, itemSchema);
            }
            return;
        }
    }

    return assertNever(schema);
};

export const getAllRefs = (schema: OpenApiType): Array<string> => {
    const result: Array<string> = [];
    getAllRefsInner(result, schema);
    return result;
};


