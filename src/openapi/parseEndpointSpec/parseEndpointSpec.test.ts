import { expect } from '../../lib.ts';
import { getPathParameters, parseEndpointSpec } from './parseEndpointSpec.ts';

Deno.test('base', () => {
    const data = {
        'parameters': [
            {
                'in': 'header',
                'name': 'traceparent',
                'schema': {
                    '$ref': '#/components/schemas/punterTraceParent'
                }
            },
            {
                'in': 'header',
                'name': 'tracestate',
                'schema': {
                    '$ref': '#/components/schemas/punterTraceState'
                }
            },
            {
                'in': 'header',
                'name': 'authorization',
                'schema': {
                    'type': 'string'
                },
                'required': false
            }
        ],
        'requestBody': {
            'content': {
                'application/json; charset=utf-8': {
                    'schema': {
                        '$ref': '#/components/schemas/HandlerSessionStaffLoginPost'
                    }
                }
            },
            'required': true
        },
        'responses': {
            '200': {
                'description': '',
                'content': {
                    'application/json; charset=utf-8': {
                        'schema': {
                            '$ref': '#/components/schemas/CreateSessionResponse'
                        }
                    }
                }
            },
            '400': {
                'description': '',
                'content': {
                    'application/json; charset=utf-8': {
                        'schema': {
                            'type': 'string'
                        }
                    }
                }
            },
            '401': {
                'description': '',
                'content': {
                    'application/json; charset=utf-8': {
                        'schema': {
                            'type': 'string'
                        }
                    }
                }
            },
            '500': {
                'description': '',
                'content': {
                    'application/json; charset=utf-8': {
                        'schema': {
                            'type': 'string'
                        }
                    }
                }
            },
            'default': {
                'description': '',
                'content': {
                    'application/json; charset=utf-8': {
                        'schema': {
                            'type': 'string'
                        }
                    }
                }
            }
        }
    };

    expect(parseEndpointSpec(null, data)).toEqual({
        'parameters': [
            {
                'in': 'header',
                'name': 'traceparent',
                'schema': {
                    'path': '#/components/schemas/punterTraceParent',
                    'type': 'ref',
                    'required': false
                }
            },
            {
                'in': 'header',
                'name': 'tracestate',
                'schema': {
                    'path': '#/components/schemas/punterTraceState',
                    'type': 'ref',
                    'required': false,
                }
            },
            {
                'in': 'header',
                'name': 'authorization',
                'schema': {
                    'required': false,
                    'nullable': false,
                    'type': 'string'
                }
            },
            {
                'in': 'body',
                'name': 'requestBody',
                'schema': {
                    'type': 'ref',
                    'path': '#/components/schemas/HandlerSessionStaffLoginPost',
                    'required': true,
                }
            }
        ],
        'responses': {
            '200': {
                'path': '#/components/schemas/CreateSessionResponse',
                'required': true,
                'type': 'ref'
            },
            '400': {
                'required': true,
                'nullable': false,
                'type': 'string'
            },
            '401': {
                'required': true,
                'nullable': false,
                'type': 'string'
            },
            '500': {
                'required': true,
                'nullable': false,
                'type': 'string'
            }
        }
    });
});

// Springdoc / Spring Boot: GET has no requestBody; 200 often uses wildcard media type ('*' + '/') and a $ref schema.
Deno.test('GET without requestBody and wildcard response content (operationId me)', () => {
    const data = {
        tags: ['user-controller'],
        operationId: 'me',
        responses: {
            '200': {
                description: 'OK',
                content: {
                    '*/*': {
                        schema: {
                            $ref: '#/components/schemas/UserDto',
                        },
                    },
                },
            },
        },
    };

    expect(parseEndpointSpec(null, data)).toEqual({
        parameters: [],
        responses: {
            '200': {
                type: 'ref',
                path: '#/components/schemas/UserDto',
                required: true,
            },
        },
    });
});


// A path item may declare parameters once for all its operations, e.g. the {brandId} of PUT and DELETE /brands/{brandId}.
Deno.test('path-level parameters are added to the operation', () => {
    const pathItem = {
        parameters: [
            { name: 'brandId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        put: {
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/BrandRequest' } } },
            },
            responses: {},
        },
    };

    expect(parseEndpointSpec(null, pathItem.put, getPathParameters(pathItem)).parameters).toEqual([
        { in: 'path', name: 'brandId', schema: { type: 'string', nullable: false, required: true } },
        { in: 'body', name: 'requestBody', schema: { type: 'ref', path: '#/components/schemas/BrandRequest', required: true } },
    ]);
});

Deno.test('an operation parameter overrides the path-level one with the same name and location', () => {
    const pathParameters = [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'id', in: 'query', required: false, schema: { type: 'string' } },
    ];
    const operation = {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {},
    };

    expect(parseEndpointSpec(null, operation, pathParameters).parameters).toEqual([
        { in: 'query', name: 'id', schema: { type: 'string', nullable: false, required: false } },
        { in: 'path', name: 'id', schema: { type: 'number', nullable: false, required: true } },
    ]);
});

Deno.test('getPathParameters reads only a path item parameters array', () => {
    const parameter = { name: 'id', in: 'path', schema: { type: 'string' } };

    expect(getPathParameters({ parameters: [parameter], get: { responses: {} } })).toEqual([parameter]);
    expect(getPathParameters({ get: { responses: {} } })).toEqual([]);
    expect(getPathParameters(null)).toEqual([]);
});
