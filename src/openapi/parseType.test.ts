import { expect } from "@std/expect";
import { parseType } from './parseType.ts';

const data = {
    'type': 'object',
    'required': [
        'data'
    ],
    'properties': {
        'data': {
            'required': [
                'legCombinations',
                'selectedBets',
                'selectedBetsInfo',
                'problems'
            ],
            'type': 'object',
            'properties': {
                'legCombinations': {
                    'type': 'array',
                    'items': {
                        'required': [
                            'id',
                            'bets',
                            'problems'
                        ],
                        'type': 'object',
                        'properties': {
                            'id': {
                                'type': 'string'
                            },
                            'bets': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/components/schemas/punterPrecisePossibleBet'
                                }
                            },
                            'problems': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/components/schemas/punterRemark'
                                }
                            }
                        }
                    }
                },
                'selectedBets': {
                    'type': 'array',
                    'items': {
                        'required': [
                            'type',
                            'stakePerLine',
                            'currency',
                            'legs',
                            'eachWay',
                            'totalStake'
                        ],
                        'type': 'object',
                        'properties': {
                            'type': {
                                '$ref': '#/components/schemas/punterBetType'
                            },
                            'stakePerLine': {
                                'type': 'string'
                            },
                            'currency': {
                                'type': 'string'
                            },
                            'legs': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/components/schemas/punterSelectedLeg'
                                }
                            },
                            'eachWay': {
                                'type': 'boolean'
                            },
                            'totalStake': {
                                'type': 'string'
                            },
                            'potentialReturns': {
                                'type': 'string'
                            },
                            'potentialMinReturns': {
                                'type': 'string'
                            },
                            'tax': {
                                'type': 'string'
                            },
                            'price': {
                                '$ref': '#/components/schemas/punterPrice'
                            },
                            'maxStake': {
                                'type': 'string'
                            }
                        }
                    }
                },
                'selectedBetsInfo': {
                    'required': [
                        'totalPotentialReturn'
                    ],
                    'type': 'object',
                    'properties': {
                        'numLinesSum': {
                            'type': 'integer',
                            'format': 'int32'
                        },
                        'calculatedStackPerLine': {
                            'type': 'string'
                        },
                        'totalPotentialReturn': {
                            'type': 'string'
                        },
                        'totalMinReturn': {
                            'type': 'string'
                        },
                        'totalMaxStake': {
                            'type': 'string'
                        }
                    }
                },
                'problems': {
                    'type': 'array',
                    'items': {
                        '$ref': '#/components/schemas/punterRemark'
                    }
                }
            }
        },
        'tags': {
            'type': 'object',
            'additionalProperties': {
                'type': 'string'
            }
        }
    }
};

Deno.test('basic', () => {
    const result = parseType(null, data);

    expect(result).toEqual({
        'props': {
            'data': {
                'nullable': false,
                'props': {
                    'legCombinations': {
                        'type': 'array',
                        'required': true,
                        'nullable': false,
                        'items': {
                            'type': 'object',
                            'required': true,
                            'nullable': false,
                            'props': {
                                'bets': {
                                    'type': 'array',
                                    'required': true,
                                    'nullable': false,
                                    'items': {
                                        'path': '#/components/schemas/punterPrecisePossibleBet',
                                        'type': 'ref',
                                        'required': true
                                    },
                                },
                                'id': {
                                    'type': 'string',
                                    'required': true,
                                    'nullable': false,
                                },
                                'problems': {
                                    'type': 'array',
                                    'required': true,
                                    'nullable': false,
                                    'items': {
                                        'path': '#/components/schemas/punterRemark',
                                        'type': 'ref',
                                        'required': true
                                    },
                                }
                            },
                        },
                    },
                    'problems': {
                        'type': 'array',
                        'required': true,
                        'nullable': false,
                        'items': {
                            'type': 'ref',
                            'path': '#/components/schemas/punterRemark',
                            'required': true
                        },
                    },
                    'selectedBets': {
                        'items': {
                            'props': {
                                'currency': {
                                    'required': true,
                                    'nullable': false,
                                    'type': 'string'
                                },
                                'eachWay': {
                                    'required': true,
                                    'nullable': false,
                                    'type': 'boolean'
                                },
                                'legs': {
                                    'items': {
                                        'path': '#/components/schemas/punterSelectedLeg',
                                        'type': 'ref',
                                        'required': true
                                    },
                                    'nullable': false,
                                    'required': true,
                                    'type': 'array'
                                },
                                'maxStake': {
                                    'nullable': false,
                                    'required': false,
                                    'type': 'string'
                                },
                                'potentialMinReturns': {
                                    'nullable': false,
                                    'required': false,
                                    'type': 'string'
                                },
                                'potentialReturns': {
                                    'nullable': false,
                                    'required': false,
                                    'type': 'string'
                                },
                                'price': {
                                    'path': '#/components/schemas/punterPrice',
                                    'type': 'ref',
                                    'required': false
                                },
                                'stakePerLine': {
                                    'nullable': false,
                                    'required': true,
                                    'type': 'string'
                                },
                                'tax': {
                                    'required': false,
                                    'nullable': false,
                                    'type': 'string'
                                },
                                'totalStake': {
                                    'nullable': false,
                                    'required': true,
                                    'type': 'string'
                                },
                                'type': {
                                    'path': '#/components/schemas/punterBetType',
                                    'type': 'ref',
                                    'required': true
                                }
                            },
                            'nullable': false,
                            'required': true,
                            'type': 'object'
                        },
                        'nullable': false,
                        'required': true,
                        'type': 'array'
                    },
                    'selectedBetsInfo': {
                        'props': {
                            'calculatedStackPerLine': {
                                'required': false,
                                'nullable': false,
                                'type': 'string'
                            },
                            'numLinesSum': {
                                'required': false,
                                'nullable': false,
                                'type': 'number'
                            },
                            'totalMaxStake': {
                                'required': false,
                                'nullable': false,
                                'type': 'string'
                            },
                            'totalMinReturn': {
                                'required': false,
                                'nullable': false,
                                'type': 'string'
                            },
                            'totalPotentialReturn': {
                                'required': true,
                                'nullable': false,
                                'type': 'string'
                            }
                        },
                        'required': true,
                        'nullable': false,
                        'type': 'object'
                    }
                },
                'required': true,
                'type': 'object'
            },
            'tags': {
                'item': {
                    'required': true,
                    'nullable': false,
                    'type': 'string'
                },
                'required': false,
                'nullable': false,
                'type': 'record'
            }
        },
        'required': true,
        'nullable': false,
        'type': 'object'
    });
});

Deno.test('literar', () => {

    const data2 = {
        type: 'object',
        required: [
            'data'
        ],
        properties: {
            data: {
                'type': 'string',
                'const': 'standard'
            },
            name: {
                'type': 'string',
            }
        }
    };

    expect(parseType(null, data2)).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            data: {
                'type': 'literal',
                'required': true,
                'nullable': false,
                'const': 'standard',
            },
            name: {
                'type': 'string',
                'required': false,
                'nullable': false,
            }
        }
    });
});

Deno.test('object', () => {
    expect(parseType(null, {
        'type': 'object',
        'required': [
            'id',
            'name',
            'sportId',
            'participants'
        ],
        'properties': {
            'id': {
                'type': 'string'
            },
            'name': {
                'type': 'string'
            },
            'sportId': {
                'type': 'string'
            },
            'participants': {
                'type': 'string'
            }
        }
    })).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            id: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
            name: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
            sportId: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
            participants: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
        }
    });


    expect(parseType(null, {
        'type': 'object',
        'required': [
            'id',
            'name',
        ],
        'properties': {
            'id': {
                'type': 'string'
            },
            'name': {
                'type': 'string'
            },
            'sportId': {
                'type': 'string'
            },
            'participants': {
                'type': 'string'
            }
        }
    })).toEqual({
        type: 'object',
        required: true,
        'nullable': false,
        props: {
            id: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
            name: {
                'type': 'string',
                'required': true,
                'nullable': false,
            },
            sportId: {
                'type': 'string',
                'required': false,
                'nullable': false,
            },
            participants: {
                'type': 'string',
                'required': false,
                'nullable': false,
            },
        }
    });
});


Deno.test('oneOf', () => {
    expect(parseType(null, {
        'oneOf': [{
            'type': 'object',
            'title': 'NewPlayerWrapper',
            'required': [
                'player'
            ],
            'properties': {
                'player': {
                    'type': 'string'
                }
            }
        }, {
            'type': 'object',
            'title': 'NewTeamWrapper',
            'required': [
                'team'
            ],
            'properties': {
                'team': {
                    'type': 'boolean'
                }
            }
        }]
    })).toEqual({
        type: 'union',
        required: true,
        'nullable': false,
        list: [{
            type: 'object',
            required: true,
            'nullable': false,
            props: {
                player: {
                    type: 'string',
                    required: true,
                    'nullable': false,
                }
            } 
        }, {
            type: 'object',
            required: true,
            'nullable': false,
            props: {
                team: {
                    type: 'boolean',
                    required: true,
                    'nullable': false,
                }
            } 
        }]
    });

    expect(parseType(null, {
        'oneOf': [{
            'type': 'object',
            'title': 'NewPlayerWrapper',
            'required': [
                'player'
            ],
            'properties': {
                'player': {
                    'type': 'string'
                }
            }
        }]
    })).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            player: {
                type: 'string',
                required: true,
                'nullable': false,
            }
        }
    });
});

Deno.test('patternProperties', () => {
    expect(parseType(null, {
        'type': 'object',
        'required': [
            'id',
            'name',
            'sportId',
            'participants'
        ],
        'properties': {
            'id': {
                'type': 'string'
            },
            'name': {
                'type': 'string'
            },
            'sportId': {
                'type': 'string'
            },
            'participants': {
                'patternProperties': {
                    '.*': {
                        'type': 'object',
                        'required': [
                            'name'
                        ],
                        'properties': {
                            'name': {
                                'type': 'string'
                            }
                        },
                    }
                }
            }
        }
    })).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            id: {
                type: 'string',
                required: true,
                nullable: false,
            },
            name: {
                type: 'string',
                required: true,
                nullable: false,
            },
            sportId: {
                type: 'string',
                required: true,
                nullable: false,
            },
            participants: {
                type: 'record',
                required: true,
                nullable: false,
                item: {
                    type: 'object',
                    required: true,
                    nullable: false,
                    props: {
                        name: {
                            type: 'string',
                            required: true,
                            nullable: false,
                        }
                    }
                }
            }
        }
    });
});


Deno.test('tuple', () => {
    expect(parseType(null, {
        'type': 'object',
        'title': 'Selection',
        'description': 'Single `Selection` object',
        'required': [
            'id',
            'name',
            'price'
        ],
        'properties': {
            'id': {
                'type': 'string'
            },
            'name': {
                'type': 'string',
                'minLength': 1,
                'description': 'Name of Selection (Usually is equal to Participant nam )\n'
            },
            'participantId': {
                'type': 'string',
                'minLength': 1
            },
            'price': {
                'type': 'array',
                'items': [
                    {
                        'type': 'integer',
                        'description': 'numerator'
                    },
                    {
                        'type': 'integer',
                        'description': 'denominator'
                    }
                ],
                'description': 'Price of selection in fractional format [2, 6]',
                'x-type': 'app::domain::models::Price'
            }
        }
    })).toEqual({
        'type': 'object',
        'required': true,
        nullable: false,
        'props': {
            'id': {
                'type': 'string',
                'required': true,
                nullable: false,
            },
            'name': {
                'type': 'string',
                'required': true,
                nullable: false,
            },
            'participantId': {
                'type': 'string',
                'required': false,
                nullable: false,
            },
            'price': {
                'type': 'tuple',
                'required': true,
                nullable: false,
                'list': [
                    {
                        'type': 'number',
                        'required': true,
                        nullable: false,
                    },
                    {
                        'type': 'number',
                        'required': true,
                        nullable: false,
                    }
                ],
            }
        },
    });
});

Deno.test('enum', () => {

    expect(parseType(null, {
        'type': 'object',
        'required': [
            'id',
            'state'
        ],
        'properties': {
            'id': {
                'type': 'string'
            },
            'state': {
                'type': 'string',
                'enum': [
                    'prematch',
                    'inplay',
                    'canceled',
                    'finished',
                    'suspended'
                ]
            }
        }
    })).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            id: {
                type: 'string',
                required: true,
                nullable: false,
            },
            state: {
                type: 'union',
                required: true,
                nullable: false,
                list: [{
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: 'prematch',
                }, {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: 'inplay',
                }, {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: 'canceled',
                }, {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: 'finished',
                }, {
                    type: 'literal',
                    required: true,
                    nullable: false,
                    const: 'suspended',
                }]
            }
        }
    });

    expect(parseType(null, {
        'type': 'string',
        'enum': [
            'win'
        ],
        'description': 'Informs about market kind'
    })).toEqual({
        type: 'literal',
        const: 'win',
        required: true,
        nullable: false,
    });
});

Deno.test('null', () => {
    expect(parseType(null, {
        'type': 'null',
    })).toEqual({
        type: 'null',
        required: true
    });
});

Deno.test('array can by empty', () => {
    expect(parseType(null, {
        'required': [
            'name'
        ],
        'type': 'object',
        'properties': {
            'name': {'type': 'null'},
            'marketBetLimits': {
                'type': 'array',
                'items': {
                    'required': [
                        'matchingMarkets',
                        'betLimits'
                    ],
                    'type': 'object',
                    'properties': {
                        'matchingMarkets': {
                            'type': 'string'
                        },
                        'betLimits': {
                            'type': 'string'
                        }
                    }
                }
            }
        }

    })).toEqual({
        type: 'object',
        required: true,
        nullable: false,
        props: {
            marketBetLimits: {
                required: false,
                nullable: false,
                type: 'array',
                items: {
                    required: true,
                    nullable: false,
                    type: 'object',
                    props: {
                        betLimits: {
                            required: true,
                            nullable: false,
                            type: 'string'
                        },
                        matchingMarkets: {
                            required: true,
                            nullable: false,
                            type: 'string'
                        }
                    }
                }
            },
            name: {
                'required': true,
                type: 'null'
            }
        }
    });
});

