import { JSONValue, isJsonObject, jsonType } from './type.ts';

export const convertRefPart = (path: string): Array<string> => {
    return path.split('/')
        .map(item => item.trim())
        .filter((item) => item !== '#')
        .filter((item) => item !== '')
    ;
};


export const getFirstPrefixFromRef = (ref: string): string => {
    const [prefix1, prefix2, ..._chunks] = convertRefPart(ref);

    if (prefix1 !== 'components') {
        throw Error('The components prefix was expected');
    }

    if (prefix2 === undefined) { 
        throw Error('The path should consist of at least three parts');
    }

    return prefix2;
};

export const convertRefPath = (path: Array<string>): string => {
    if (path.length === 0) {
        throw Error('path is empty');
    }

    return `#/${path.join('/')}`;
};

export const getFromRefByPath = (base: Array<string>, json: JSONValue, ref: Array<string>): JSONValue => {
    const [refChunk, ...restRef] = ref;

    if (refChunk === undefined) {
        return json;
    }

    if (isJsonObject(json)) {
        const newJson = json[refChunk];

        if (newJson === undefined) {
            throw Error(`JSONValue was expected at ref=${convertRefPath([...base, refChunk])} found undefined`);
        }
    
        return getFromRefByPath([...base, refChunk], newJson, restRef);
    } else {
        throw Error(`JSONObject was expected at ref=${convertRefPath(base)} found ${jsonType(json)}`);
    }
};

export const getFromObjectByPath = (json: JSONValue, ref: Array<string>): JSONValue => {
    return getFromRefByPath([], json, ref);
};

export const getFromRef = (json: JSONValue, ref: string): JSONValue => {
    const refPath = convertRefPart(ref);
    return getFromRefByPath([], json, refPath);
};

// export const getFromRef = (json: JSONValue, ref: string): JSONValue => {
//     const result = getFromRefResult(json, ref);

//     if (result.type === 'ok') {
//         return result.value;
//     }

//     throw Error(result.message);
// };

export const isComponentsModelRef = (json: JSONValue, ref: string): boolean => {
    const path = convertRefPart(ref);

    const [name, ...rest] = path;

    if (name === 'components' && rest.length === 2) {
        const subJson = getFromRef(json, ref);

        if (isJsonObject(subJson) && typeof subJson['type'] === 'string') {
            return true;
        }
    }

    return false;
};

const derefSchemaInner = (json: JSONValue, base: JSONValue): JSONValue => {
    if (json === null) {
        return null;
    }

    if (json === undefined) {
        return undefined;
    }

    if (typeof json === 'string') {
        return json;
    }

    if (typeof json === 'number') {
        return json;
    }

    if (typeof json === 'boolean') {
        return json;
    }

    if (Array.isArray(json)) {
        return json.map((item) => derefSchemaInner(item, base));
    }

    if (typeof json['$ref'] !== 'undefined') {


        /*
            {
                "xml": {
                    "name": "tag"
                },
                "$ref": "#/definitions/Tag"
            }
        */

        const { xml: _xml, $ref: _$ref, ...restJson } = json;

        if (Object.keys(restJson).length !== 0) {
            throw Error('Expectet one key');
        }

        const ref = json['$ref'];

        if (typeof ref !== 'string') {
            throw Error('ref expected toBe string');
        }

        if (isComponentsModelRef(base, ref)) {
            //do not expand references
        } else {
            return getFromRef(base, ref);
        }
    }

    const result: Record<string, JSONValue> = {};

    for (const [name, value] of Object.entries(json)) {
        result[name] = derefSchemaInner(value, base);
    }

    return result;
};
export const derefSchema = (json: JSONValue): JSONValue => {
    return derefSchemaInner(json, json);
};
