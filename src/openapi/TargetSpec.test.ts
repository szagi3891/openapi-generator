import { expect } from '../lib.ts';
import { parseTargetSpecJson } from './TargetSpec.ts';

const stripAnsi = (text: string): string => text.replace(/\u001b\[[0-9;]*m/g, '');

Deno.test('spec.json defaults credentials to omit', () => {
    expect(parseTargetSpecJson(JSON.stringify({
        endpoints: {
            blablabla: {
                method: 'get',
                url: '/pets',
            },
        },
    }))).toEqual({
        credentials: 'omit',
        endpoints: {
            blablabla: {
                method: 'get',
                url: '/pets',
            },
        },
    });
});

Deno.test('spec.json accepts credentials values', () => {
    expect(parseTargetSpecJson(JSON.stringify({
        credentials: 'include',
        endpoints: {
            blablabla: {
                method: 'get',
                url: '/pets',
            },
        },
    })).credentials).toBe('include');

    expect(parseTargetSpecJson(JSON.stringify({
        credentials: 'same-origin',
        endpoints: {
            blablabla: {
                method: 'get',
                url: '/pets',
            },
        },
    })).credentials).toBe('same-origin');
});

Deno.test('spec.json reports helpful error for old format', () => {
    try {
        parseTargetSpecJson(JSON.stringify({
            blablabla: {
                method: 'get',
                url: '/pets',
            },
        }), './example/target/spec.json');
        throw new Error('expected parseTargetSpecJson to throw');
    } catch (error) {
        const message = stripAnsi(error instanceof Error ? error.message : String(error));
        expect(message).toContain('Invalid ./example/target/spec.json');
        expect(message).toContain('old spec.json format');
        expect(message).toContain('"endpoints"');
        expect(message).toContain('Expected spec.json shape:');
    }
});

Deno.test('spec.json reports helpful error for invalid credentials', () => {
    try {
        parseTargetSpecJson(JSON.stringify({
            credentials: 'bad',
            endpoints: {},
        }));
        throw new Error('expected parseTargetSpecJson to throw');
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        expect(message).toContain('credentials');
        expect(message).toContain('"omit" (default), "same-origin", "include"');
    }
});
