import { expect } from '../lib.ts';
import { parseContent } from './parseSpecContent.ts';

Deno.test('parseContent parses JSON from .json path', async () => {
    expect(await parseContent('/spec.json', '{"openapi":"3.0.0"}')).toEqual({ openapi: '3.0.0' });
});

Deno.test('parseContent parses YAML from .yaml path', async () => {
    expect(await parseContent('/openapi.yaml', 'openapi: "3.0.0"\ninfo:\n  title: Petstore')).toEqual({
        openapi: '3.0.0',
        info: { title: 'Petstore' },
    });
});

Deno.test('parseContent parses YAML from .yml path', async () => {
    expect(await parseContent('/openapi.yml', 'openapi: "3.0.0"')).toEqual({ openapi: '3.0.0' });
});

Deno.test('parseContent throws on unsupported extension', async () => {
    await expect(parseContent('/spec.txt', '{}')).rejects.toThrow('Unsupported spec file extension');
});

Deno.test('parseContent throws on invalid JSON', async () => {
    await expect(parseContent('spec.json', '{invalid')).rejects.toThrow(
        'Failed to parse OpenAPI spec as JSON (spec.json)',
    );
});

Deno.test('parseContent throws on invalid YAML', async () => {
    await expect(parseContent('spec.yml', 'openapi: [')).rejects.toThrow(
        'Failed to parse OpenAPI spec as YAML (spec.yml)',
    );
});
