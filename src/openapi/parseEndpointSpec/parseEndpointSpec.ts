import { z } from '../../lib.ts';
import { parseType, setRequired } from '../parseType.ts';
import { OpenApiType, EndpointSpecType, JSONValue } from '../type.ts';
import { convertParameters } from './convertParameters.ts';

const EndopointZod = z.object({
    parameters: z.array(z.unknown()),
    requestBody: z.unknown(),
    responses: z.unknown(),
});

const ContentDataZod = z.record(z.string(), z.object({
    schema: z.unknown(),
}));

const getTypeFromContent = (rawSpec: JSONValue, content: z.TypeOf<typeof ContentDataZod> | undefined): OpenApiType => {
    if (content === undefined) {
        return { type: 'unknown' };
    }
    const [ first, ...rest ] = Object.values(content);

    if (first !== undefined && rest.length === 0) {
        return parseType(rawSpec, first.schema);
    }

    throw Error('getTypeFromContent - Error parse');
};

const requestBodyZod = z.object({
    content: ContentDataZod,
    required: z.boolean(),
});

const convertRequestBody = (rawSpec: JSONValue, data: unknown): OpenApiType => {
    const safeData = requestBodyZod.parse(data);
    const schema = getTypeFromContent(rawSpec, safeData.content);
    return setRequired(schema, safeData.required);
};

const ResponsesZod = z.record(z.string(), z.object({
    content: ContentDataZod.optional(),
}));

const convertResponses = (rawSpec: JSONValue, data: unknown): EndpointSpecType['responses'] => {
    const safeData = ResponsesZod.parse(data);
    const result: EndpointSpecType['responses'] = {};

    for (const [code, response] of Object.entries(safeData)) {
        if (code.toLocaleLowerCase() === 'default') {
            //ignore
        } else {
            result[code] = getTypeFromContent(rawSpec, response.content);
        }
    }

    return result;
};

export const parseEndpointSpec = (rawSpec: JSONValue, data: unknown): EndpointSpecType => {
    const safeData = EndopointZod.safeParse(data);

    // const safeData = DataZod.safeParse(data);

    if (!safeData.success) {
        console.info(JSON.stringify(data, null, 4));
        throw Error('parseError');
    }

    const parameters = convertParameters(rawSpec, safeData.data.parameters);

    if (safeData.data.requestBody !== undefined) {
        const requestBody = convertRequestBody(rawSpec, safeData.data.requestBody);
        parameters.push({
            in: 'body',
            name: 'requestBody',
            schema: requestBody
        });
    }

    return {
        parameters,
        responses: convertResponses(rawSpec, safeData.data.responses),
    };
};


