export type OpenApiType = {
    type: 'ref';
    path: string;
    required: boolean;
} | {
    type: 'literal';
    const: string;
    required: boolean;
    nullable: boolean;
} | {
    type: 'string';
    required: boolean;
    nullable: boolean;
} | {
    type: 'number';
    required: boolean;
    nullable: boolean;
} | {
    type: 'boolean';
    required: boolean;
    nullable: boolean;
} | {
    type: 'array';
    required: boolean;
    items: OpenApiType;
    nullable: boolean;
} | {
    type: 'object';
    required: boolean;
    props: Record<string, OpenApiType>;
    nullable: boolean;
} | {
    type: 'record';
    required: boolean;
    item: OpenApiType;
    nullable: boolean;
} | {
    type: 'union';
    required: boolean;
    list: Array<OpenApiType>;
    nullable: boolean;
} | {
    type: 'tuple';
    required: boolean;
    list: Array<OpenApiType>;
    nullable: boolean;
} | {
    type: 'null';
    required: boolean;
} | {
    type: 'unknown';
};

export interface RequireSpecType {
    name: string;
    methods: Record<string, {
        url: string;
        method: string;
    }>;
}

export type SpecSourceType = {
    type: 'file';
    path: string;
} | {
    type: 'remote';
    url: string;
    doc: string;
    json: string;
    yaml: string;
};

export type JSONValue =
    | null
    | undefined
    | string
    | number
    | boolean
    | JSONObject
    | Array<JSONValue>;

export interface JSONObject {
    [x: string]: JSONValue;
}

export const isJsonObject = (value: JSONValue): value is JSONObject => {

    if (value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        Array.isArray(value)
    ) {
        return false;
    }

    return true;
};

export const jsonType = (value: JSONValue): 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'array' | 'object' => {
    if (value === null) {
        return 'null';
    }

    if (value === undefined) {
        return 'undefined';
    }
    if (typeof value === 'string') {
        return 'string';
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'boolean') {
        return 'boolean';
    }

    if (Array.isArray(value)) {
        return 'array';
    }
    
    return 'object';
};

export interface EndpointSpecType {
    parameters: Array<{
        in: 'path' | 'query' | 'header' | 'body'; //cookie ?
        name: string;
        schema: OpenApiType;
    }>;
    responses: Record<string, OpenApiType>;
}
