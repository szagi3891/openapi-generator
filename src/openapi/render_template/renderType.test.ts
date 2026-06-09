import { expect } from '../../lib.ts';
import { renderType } from './renderType.ts';
import type { OpenApiType } from '../type.ts';

const checkoutProcessStepType: OpenApiType = {
    type: 'union',
    required: false,
    nullable: true,
    list: [
        { type: 'literal', required: true, nullable: false, const: 'DELIVERY' },
        { type: 'literal', required: true, nullable: false, const: 'BILLING' },
        { type: 'literal', required: true, nullable: false, const: 'PAYMENT' },
        { type: 'literal', required: true, nullable: false, const: 'PAID' },
        { type: 'literal', required: true, nullable: false, const: 'FINALIZE' },
    ],
};

const checkoutProcessStepWithObjectType: OpenApiType = {
    type: 'union',
    required: false,
    nullable: true,
    list: [
        { type: 'literal', required: true, nullable: false, const: 'DELIVERY' },
        { type: 'literal', required: true, nullable: false, const: 'BILLING' },
        { type: 'literal', required: true, nullable: false, const: 'PAYMENT' },
        { type: 'literal', required: true, nullable: false, const: 'PAID' },
        {
            type: 'object',
            required: true,
            nullable: false,
            props: {
                id: { type: 'number', required: true, nullable: false },
                age: { type: 'number', required: true, nullable: false },
            },
        },
    ],
};

Deno.test('renderType renders string enum union as z.enum', () => {
    expect(renderType(0, checkoutProcessStepType)).toBe(
        "z.enum(['DELIVERY', 'BILLING', 'PAYMENT', 'PAID', 'FINALIZE']).optional().nullable()",
    );
});

Deno.test('renderType renders string enum union as z.enum inside object property', () => {
    const objectType: OpenApiType = {
        type: 'object',
        required: true,
        nullable: false,
        props: {
            checkoutProcessStep: checkoutProcessStepType,
        },
    };

    expect(renderType(0, objectType)).toBe(`z.object({
    checkoutProcessStep: z.enum(['DELIVERY', 'BILLING', 'PAYMENT', 'PAID', 'FINALIZE']).optional().nullable(),
})`);
});

Deno.test('renderType keeps z.union when union contains an object variant', () => {
    expect(renderType(0, checkoutProcessStepWithObjectType)).toBe(`z.union([z.literal('DELIVERY'), z.literal('BILLING'), z.literal('PAYMENT'), z.literal('PAID'), z.object({
    id: z.number(),
    age: z.number(),
})]).optional().nullable()`);
});

Deno.test('renderType keeps z.union for non-homogeneous unions', () => {
    const mixedUnion: OpenApiType = {
        type: 'union',
        required: true,
        nullable: false,
        list: [
            { type: 'literal', required: true, nullable: false, const: 'DELIVERY' },
            { type: 'string', required: true, nullable: false },
        ],
    };

    expect(renderType(0, mixedUnion)).toBe(
        "z.union([z.literal('DELIVERY'), z.string()])",
    );
});
