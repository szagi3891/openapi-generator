import { expect } from '@std/expect';
import { convertRefPart, derefSchema, getFirstPrefixFromRef, getFromRef, isComponentsModelRef } from './isPrimitiveType.ts';

const data = {
    'requestBodies': {
        'punterCreatePossibleBet': {
            'required': true,
            'content': {
                'application/json': {
                    'schema': {
                        '$ref': '#/components/schemas/punterPrecisePossibleBetsRequest'
                    }
                }
            }
        },
    },
    'definitions': {
        'CasinoBannerInsertModel': {
            'type': 'object',
            'properties': {
                'date_end': {
                    'type': 'string'
                },
                'date_start': {
                    'type': 'string'
                },
                'image_desktop': {
                    'type': 'string'
                },
                'image_mobile': {
                    'type': 'string'
                },
                'image_tablet': {
                    'type': 'string'
                },
                'published': {
                    'type': 'boolean'
                },
                'redirect_game': {
                    'type': 'integer',
                    'format': 'int32'
                },
                'redirect_type': {
                    'type': 'string'
                },
                'redirect_url': {
                    'type': 'string'
                },
                'terms_full': {
                    'type': 'string'
                },
                'terms_headline': {
                    'type': 'string'
                },
                'title': {
                    'type': 'string'
                }
            },
            'required': [
                'date_end',
                'date_start',
                'image_desktop',
                'image_mobile',
                'image_tablet',
                'published',
                'terms_full',
                'terms_headline',
                'title'
            ]
        },
    }
};

const data2 = {
    'requestBodies': {
        'punterCreatePossibleBet': {
            '$ref': '#/components/request/punterCreatePossibleBet',
        },
    },
    'components': {
        'request': {
            'punterCreatePossibleBet': {
                'required': true,
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/definitions/CasinoBannerInsertModel'
                        }
                    }
                }
            },
            'aaa': {
                '$ref': '#/components/models/aaaa'
            },
            'CasinoBannerInsertModel': {
                'type': 'object',
                'properties': {
                    'date_end': {
                        'type': 'string'
                    },
                    'date_start': {
                        'type': 'string'
                    },
                },
                'required': [
                    'date_end',
                    'date_start',
                ]
            },
        },
        'models': {
            aaaa: {
                'type': 'object',
                'properties': {
                    'date_end': {
                        'type': 'string'
                    },
                    'date_start': {
                        'type': 'string'
                    },
                },
                'required': [
                    'date_end',
                    'date_start',
                ]
            }
        }
    },
    'definitions': {
        'CasinoBannerInsertModel': {
            'type': 'object',
            'properties': {
                'date_end': {
                    'type': 'string'
                },
                'date_start': {
                    'type': 'string'
                },
            },
            'required': [
                'date_end',
                'date_start',
            ]
        },
    }
};


Deno.test('convertRefPart', () => {
    expect(convertRefPart('#/components/schemas/punterTraceState'))
        .toEqual(['components', 'schemas', 'punterTraceState']);

    expect(convertRefPart('#/requestBodies/punterCreatePossibleBet'))
        .toEqual(['requestBodies', 'punterCreatePossibleBet']);

    expect(convertRefPart('#/definitions/CasinoBannerInsertModel'))
        .toEqual(['definitions', 'CasinoBannerInsertModel']);
});

Deno.test('getFromRef', () => {
    expect(getFromRef(data, '#/requestBodies/punterCreatePossibleBet')).toEqual({
        'required': true,
        'content': {
            'application/json': {
                'schema': {
                    '$ref': '#/components/schemas/punterPrecisePossibleBetsRequest'
                }
            }
        }
    });

    expect(getFromRef(data, '#/definitions/CasinoBannerInsertModel/properties/date_end'))
        .toEqual({
            'type': 'string'
        });

    expect(() => getFromRef(data, '#/definitions/CasinoBannerInsertModel/properties/date_end/ffff'))
        .toThrow('JSONValue was expected at ref=#/definitions/CasinoBannerInsertModel/properties/date_end/ffff found undefined');

    expect(() => getFromRef(data, '#/defini')).toThrow('JSONValue was expected at ref=#/defini found undefined');
});

Deno.test('Basic market', () => {
    expect(isComponentsModelRef(data2, '#/requestBodies/punterCreatePossibleBet')).toBe(false);
    expect(isComponentsModelRef(data2, '#/definitions/CasinoBannerInsertModel')).toBe(false);
    expect(isComponentsModelRef(data2, '#/components/request/CasinoBannerInsertModel')).toBe(true);
    expect(isComponentsModelRef(data2, '#/components/schemas/punterEmptySelectedLeg/dddd')).toBe(false);
});

Deno.test('Deref', async () => {
    expect(derefSchema(333)).toEqual(333);
    expect(derefSchema(null)).toEqual(null);
    expect(derefSchema(undefined)).toEqual(undefined);

    expect(derefSchema(data2)).toEqual({
        'requestBodies': {
            'punterCreatePossibleBet': {
                'required': true,
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/definitions/CasinoBannerInsertModel'
                        }
                    }
                }
            },
        },
        'components': {
            'request': {
                'punterCreatePossibleBet': {
                    'required': true,
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'object',
                                'properties': {
                                    'date_end': {
                                        'type': 'string'
                                    },
                                    'date_start': {
                                        'type': 'string'
                                    },
                                },
                                'required': [
                                    'date_end',
                                    'date_start',
                                ]
                            }
                        }
                    }
                },
                'aaa': {
                    '$ref': '#/components/models/aaaa'
                },
                'CasinoBannerInsertModel': {
                    'type': 'object',
                    'properties': {
                        'date_end': {
                            'type': 'string'
                        },
                        'date_start': {
                            'type': 'string'
                        },
                    },
                    'required': [
                        'date_end',
                        'date_start',
                    ]
                },
            },
            'models': {
                aaaa: {
                    'type': 'object',
                    'properties': {
                        'date_end': {
                            'type': 'string'
                        },
                        'date_start': {
                            'type': 'string'
                        },
                    },
                    'required': [
                        'date_end',
                        'date_start',
                    ]
                }
            },
        },
        'definitions': {
            'CasinoBannerInsertModel': {
                'type': 'object',
                'properties': {
                    'date_end': {
                        'type': 'string'
                    },
                    'date_start': {
                        'type': 'string'
                    },
                },
                'required': [
                    'date_end',
                    'date_start',
                ]
            },
        }
    });
});

Deno.test('getFirstPrefixFromRef', () => {
    expect(() => getFirstPrefixFromRef('#/requestBodies/punterCreatePossibleBet'))
        .toThrow('The components prefix was expected');

    expect(getFirstPrefixFromRef('#/components/definitions')).toBe('definitions');
    expect(getFirstPrefixFromRef('#/components/request/CasinoBannerInsertModel')).toBe('request');
    expect(() => getFirstPrefixFromRef('')).toThrow('The components prefix was expected');
    expect(() => getFirstPrefixFromRef('#/')).toThrow('The components prefix was expected');
});


