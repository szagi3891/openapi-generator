import { expect } from "../../lib.ts";
import { getAllRefs } from './getAllRefs.ts';


Deno.test('getAllRefs', () => {

    const refs = getAllRefs({
        nullable: false,
        type: 'object',
        required: true,
        props: {
            prop1: {
                type: 'array',
                required: true,
                nullable: false,
                items: {
                    'path': '#/components/schemas/punterTraceParent',
                    'type': 'ref',
                    required: true,
                }
            },
            prop2: {
                'path': '#/components/schemas/punterTraceState',
                'type': 'ref',
                required: true,
            },
            prop3: {
                type: 'object',
                required: true,
                nullable: false,
                props: {
                    prop1: {
                        'path': '#/components/schemas/rrrrrr',
                        'type': 'ref',
                        required: true,
                    },
                    prop2: {
                        'path': '#/components/schemas/yyyyyy',
                        'type': 'ref',
                        required: true,
                    },
                    prop3: {
                        type: 'object',
                        required: true,
                        nullable: false,
                        props: {
                            aaa: {
                                'path': '#/components/dddddddd',
                                'type': 'ref',
                                required: true,
                            }
                        }
                    },
                    prop4: {
                        type: 'union',
                        required: true,
                        nullable: false,
                        list: [
                            {
                                'path': '#/rrrrrreeeee',
                                'type': 'ref',
                                required: true,
                            },
                            {
                                type: 'string',
                                required: true,
                                nullable: false,
                            },
                            {
                                type: 'record',
                                required: true,
                                nullable: false,
                                item: {
                                    type: 'tuple',
                                    required: true,
                                    nullable: false,
                                    list: [
                                        {
                                            'path': '#/ttttt',
                                            'type': 'ref',
                                            required: true,
                                        },
                                        {
                                            'path': '#/yyyyy',
                                            'type': 'ref',
                                            required: true,
                                        },
                                        {
                                            type: 'literal',
                                            required: true,
                                            nullable: false,
                                            const: 'fff'
                                        },
                                        {
                                            type: 'number',
                                            required: true,
                                            nullable: false,
                                        },
                                        {
                                            type: 'boolean',
                                            required: true,
                                            nullable: false,
                                        },
                                        {
                                            type: 'unknown'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }

    });
    expect(refs).toEqual([
        '#/components/schemas/punterTraceParent',
        '#/components/schemas/punterTraceState',
        '#/components/schemas/rrrrrr',
        '#/components/schemas/yyyyyy',
        '#/components/dddddddd',
        '#/rrrrrreeeee',
        '#/ttttt',
        '#/yyyyy'
    ]);
});

