import { expect } from '../../lib.ts';
import { generateUrlAll } from './generateUrlAll.ts';
import type { EndpointSpecType } from '../type.ts';

const handler = (parameters: EndpointSpecType['parameters'] = []): EndpointSpecType => ({
    parameters,
    responses: {},
});

const pathParam = (name: string): EndpointSpecType['parameters'][number] => ({
    in: 'path',
    name,
    schema: { type: 'string', required: true, nullable: false },
});

Deno.test('generateUrlAll substitutes whole-segment path params', () => {
    const result = generateUrlAll('/item/{ean}', handler([pathParam('ean')]));

    expect(result).toContain('/item/${params.ean}${query}');
});

Deno.test('generateUrlAll substitutes path params embedded in a segment (e.g. {ean}:resolve)', () => {
    const result = generateUrlAll('/item/{ean}:resolve', handler([pathParam('ean')]));
    
    expect(result).toContain('/item/${params.ean}:resolve${query}');
    expect(result).not.toContain('{ean}');
});

Deno.test('generateUrlAll substitutes camelCased path params in custom method segments', () => {
    const result = generateUrlAll(
        '/orders/{order-id}:cancel',
        handler([pathParam('order-id')]),
    );

    expect(result).toContain('/orders/${params.orderId}:cancel${query}');
    expect(result).not.toContain('{order-id}');
});
