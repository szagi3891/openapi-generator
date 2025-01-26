import { expect } from '../../lib.ts';
import { convertParameters } from './convertParameters.ts';

Deno.test('base 1', () => {
    expect(convertParameters(null, [
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
    ])).toEqual([
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
                'required': false
            }
        },
        {
            'in': 'header',
            'name': 'authorization',
            'schema': {
                'nullable': false,
                'required': false,
                'type': 'string'
            }
        }
    ]);
});

Deno.test('base 2', () => {
    expect(convertParameters(null, [{
        'in': 'header',
        'name': 'traceparent',
        'schema': {
            '$ref': '#/components/schemas/punterTraceParent',
        },
        'required': true
    }, {
        'in': 'header',
        'name': 'tracestate',
        'schema': {
            '$ref': '#/components/schemas/punterTraceState',
        }
    }, {
        'in': 'header',
        'name': 'authorization',
        'schema': {
            'type': 'string'
        },
        'required': false
    }])).toEqual([{
        'in': 'header',
        'name': 'traceparent',
        'schema': {
            'type': 'ref',
            'path': '#/components/schemas/punterTraceParent',
            'required': true,
        }
    }, {
        'in': 'header',
        'name': 'tracestate',
        'schema': {
            'type': 'ref',
            'path': '#/components/schemas/punterTraceState',
            'required': false,
        }
    }, {
        'in': 'header',
        'name': 'authorization',
        'schema': {
            'nullable': false,
            'type': 'string',
            'required': false
        }
    }]);
});

Deno.test('base 3', () => {
    expect(convertParameters(null, [{
        'in': 'header',
        'name': 'traceparent',
        'schema': {
            '$ref': '#/components/schemas/punterTraceParent'
        }
    }, {
        'in': 'header',
        'name': 'tracestate',
        'schema': {
            '$ref': '#/components/schemas/punterTraceState'
        }
    }, {
        'in': 'header',
        'name': 'authorization',
        'schema': {
            'type': 'string'
        },
        'required': false
    }])).toEqual([{
        'in': 'header',
        'name': 'traceparent',
        'schema': {
            'path': '#/components/schemas/punterTraceParent',
            'type': 'ref',
            'required': false
        },
    }, {
        'in': 'header',
        'name': 'tracestate',
        'schema': {
            'path': '#/components/schemas/punterTraceState',
            'type': 'ref',
            'required': false
        },
    }, {
        'in': 'header',
        'name': 'authorization',
        'schema': {
            'nullable': false,
            'required': false,
            'type': 'string',
        },
    }]);
});

