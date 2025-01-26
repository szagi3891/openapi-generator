import { expect } from '../../lib.ts';
import { parseEndpointSpec } from './parseEndpointSpec.ts';

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

