import { z } from '../lib.ts';
import { filterXProprty } from './filterXProprty.ts';
import { JSONValue, OpenApiType } from './type.ts';
import { getFromRef } from './isPrimitiveType.ts';
import { assertNever } from '../lib.ts';

export const setRequired = (dataType: OpenApiType, required: boolean): OpenApiType => {
    switch (dataType.type) {
        case 'ref': {
            return {
                ...dataType,
                required
            };
        }
        case 'literal': {
            return {
                ...dataType,
                required
            };
        }
        case 'string': {
            return {
                ...dataType,
                required
            };
        }
        case 'number': {
            return {
                ...dataType,
                required
            };
        }
        case 'boolean': {
            return {
                ...dataType,
                required
            };
        }
        case 'array': {
            return {
                ...dataType,
                required,
                items: dataType.items
            };
        }
        case 'object': {
            return {
                ...dataType,
                required,
            };
        }
        case 'record': {
            return {
                ...dataType,
                required,
            };
        }
        case 'union': {
            return {
                ...dataType,
                required,
            };
        }
        case 'tuple': {
            return {
                ...dataType,
                required,
            };
        }
        case 'null': {
            return {
                ...dataType,
                required,
            };
        }
        case 'unknown': {
            return dataType;
        }
    }

    return assertNever(dataType);
};

const TypeRefZod = z.object({
    $ref: z.string(),
}).strict();

const TypeStringConstZod = z.object({
    type: z.literal('string'),
    const: z.string(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
    example: z.string().optional(), //ignore
    format: z.string().optional(), //ignore
}).strict();

const TypeStringConstWithoutTypeZod = z.object({
    const: z.string(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeStringEnumZod = z.object({
    type: z.literal('string'),
    enum: z.array(z.string()),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
    example: z.string().optional(), //ignore
    format: z.string().optional(), //ignore
}).strict();

const TypeStringZod = z.object({
    type: z.literal('string'),
    nullable: z.boolean().optional(),
    minLength: z.number().optional(), //ignore
    description: z.string().optional(), //ignore
    example: z.string().optional(), //ignore
    format: z.string().optional(), //ignore
}).strict();

const TypeIntegerZod = z.object({
    type: z.literal('integer'),
    format: z.string().optional(),
    nullable: z.boolean().optional(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
    min: z.number().optional(), //ignore
    minimum: z.number().optional(), //ignore
    maximum: z.number().optional(), //ignore,
}).strict();

const TypeNumberZod = z.object({
    type: z.literal('number'),
    format: z.string().optional(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeBooleanZod = z.object({
    type: z.literal('boolean'),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeObjectNoValueZod = z.object({
    type: z.literal('object'),
}).strict();

const TypeObjectZod = z.object({
    type: z.literal('object'),
    required: z.array(z.string()).optional(),
    properties: z.record(z.string(), z.unknown()),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeObjectAdditionalPropertiesZod = z.object({
    type: z.literal('object'),
    additionalProperties: z.unknown(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeTupleZod = z.object({
    type: z.literal('array'),
    items: z.array(z.unknown()),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeArrayZod = z.object({
    type: z.literal('array'),
    items: z.unknown(),
    maxItems: z.number().optional(), //ignore
    nullable: z.boolean().optional(),
    title: z.string().optional(), //ignore
    description: z.string().optional(), //ignore
}).strict();

const TypeOneOfZod = z.object({
    oneOf: z.array(z.unknown())
}).strict();


const TypePatternPropertiesZod = z.object({
    patternProperties: z.object({
        '.*': z.unknown()
    }).strict()
}).strict();

const TypeEmptyObjectZed = z.object({}).strict();

const TypeEnumZod = z.object({
    type: z.literal('enum'),
    enum: z.array(z.string())
});

const TypeNullZod = z.object({
    type: z.literal('null')
});

const TypeOneofWithDiscriminatorZod = z.object({
    oneOf: z.array(z.unknown()), //ignore
    discriminator: z.object({
        propertyName: z.string(),
        mapping: z.record(z.string(), z.string())
    }).strict()
}).strict();

export const parseType = (rawSpec: JSONValue, dataIn: unknown): OpenApiType => {
    const data = filterXProprty(dataIn);

    {
        const safeData = TypeRefZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'ref',
                path: safeData.data.$ref,
                required: true
            };
        }
    }

    {
        const safeData = TypeStringConstZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'literal',
                const: safeData.data.const,
                required: true,
                nullable: false
            };
        }
    }

    {
        const safeData = TypeStringConstWithoutTypeZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'literal',
                const: safeData.data.const,
                required: true,
                nullable: false
            };
        }
    }

    {
        const safeData = TypeStringEnumZod.safeParse(data);
        if (safeData.success) {
            const [ first, ...rest ] = safeData.data.enum;

            if (rest.length === 0) {
                if (first === undefined) {
                    throw Error('At least one variant was expected in enum');
                }

                return {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: first,
                };
            }

            return {
                type: 'union',
                required: true,
                nullable: false,
                list: safeData.data.enum.map((enumItem) => ({
                    type: 'literal',
                    required: true,
                    const: enumItem,
                    nullable: false
                }))
            };
        }
    }

    {
        const safeData = TypeStringZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'string',
                required: true,
                nullable: safeData.data.nullable ?? false
            };
        }
    }

    {
        const safeData = TypeNumberZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'number',
                required: true,
                nullable: false
            };
        }
    }
    {
        const safeData = TypeIntegerZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'number',
                required: true,
                nullable: safeData.data.nullable ?? false
            };
        }
    }

    {
        const safeData = TypeBooleanZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'boolean',
                required: true,
                nullable: false
            };
        }
    }
    {
        const safeData = TypeObjectNoValueZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'unknown',
            };
        }
    }
    {
        const safeData = TypeObjectZod.safeParse(data);

        if (safeData.success) {
            const props: Record<string, OpenApiType> = {};

            for (const [name, value] of Object.entries(safeData.data.properties)) {
                const isRequire = safeData.data.required?.includes(name) ?? false;
                props[name] = setRequired(parseType(rawSpec, value), isRequire);
            }

            return {
                type: 'object',
                required: true,
                nullable: false,
                props
            };
        }
    }

    {
        const safeData = TypeObjectAdditionalPropertiesZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'record',
                required: true,
                nullable: false,
                item: parseType(rawSpec, safeData.data.additionalProperties)
            };
        }
    }

    {
        const safeData = TypeTupleZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'tuple',
                required: true,
                nullable: false,
                list: safeData.data.items.map((item) => parseType(rawSpec, item)),
            };
        }
    }

    {
        const safeData = TypeArrayZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'array',
                required: true,
                nullable: safeData.data.nullable ?? false,
                items: parseType(rawSpec, safeData.data.items)
            };
        }
    }

    {
        const safeData = TypeOneOfZod.safeParse(data);
        if (safeData.success) {
            const [ first, ...rest ] = safeData.data.oneOf;

            if (rest.length === 0) {
                if (first === undefined) {
                    throw Error('At least one variant was expected in oneOf');
                }

                return parseType(rawSpec, first);
            }

            return {
                type: 'union',
                required: true,
                nullable: false,
                list: safeData.data.oneOf.map(item => parseType(rawSpec, item)),
            };
        }
    }

    {
        const safeData = TypePatternPropertiesZod.safeParse(data);
        if (safeData.success) {
            return {
                type: 'record',
                required: true,
                nullable: false,
                item: parseType(rawSpec, safeData.data.patternProperties['.*'])
            };
        }
    }

    {
        const safeData = TypeEmptyObjectZed.safeParse(data);
        if (safeData.success) {
            return {
                type: 'unknown'
            };
        }
    }

    {
        const safeData = TypeEnumZod.safeParse(data);
        if (safeData.success) {
            const [ first, ...rest ] = safeData.data.enum;
            if (first === undefined) {
                throw Error('At least one variant was expected in enum');
            }

            if (rest.length === 0) {
                return {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: first,
                };
            }

            return {
                type: 'union',
                required: true,
                nullable: false,
                list: safeData.data.enum.map((enumItem) => ({
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: enumItem,
                }))
            };
        }
    }

    {
        const safeData = TypeOneofWithDiscriminatorZod.safeParse(data);
        if (safeData.success) {

            const union: Array<OpenApiType> = [];

            const { propertyName, mapping } = safeData.data.discriminator;

            for (const [ mappingKey, ref ] of Object.entries(mapping)) {
                const objectDef = parseType(rawSpec, getFromRef(rawSpec, ref));

                if (objectDef.type !== 'object') {
                    throw Error(`Object expected ref=${ref}`);
                }

                union.push({
                    type: 'object',
                    required: objectDef.required,
                    nullable: false,
                    props: {
                        ...objectDef.props,
                        [propertyName]: {
                            type: 'literal',
                            const: mappingKey,
                            required: true,
                            nullable: false,
                        }
                    }
                });
            }
            
            const [ unionFirst, ...unionRest ] = union;

            if (unionFirst !== undefined && unionRest.length === 0) {
                return unionFirst;
            }

            return {
                type: 'union',
                required: true,
                nullable: false,
                list: union
            };
        }
    }

    {
        const safeDAta = TypeNullZod.safeParse(data);
        if (safeDAta.success) {
            return {
                type: 'null',
                required: true,
            };
        }

    }

    console.info(JSON.stringify(data, null, 4));
    throw Error('Unknown shape of data');
};

