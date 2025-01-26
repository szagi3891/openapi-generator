import { expect } from "../../lib.ts";
import { toBigCamelCase, wordFirstLetterToLower } from './toBigCamelCase.ts';

Deno.test('toBigCamelCase', () => {

    expect(toBigCamelCase('openapi_socket_get_market')).toBe('OpenapiSocketGetMarket');
});

Deno.test('wordFirstLetterToUpper', () => {
    expect(wordFirstLetterToLower('Openapi')).toBe('openapi');
    expect(wordFirstLetterToLower('O')).toBe('o');
    expect(wordFirstLetterToLower('')).toBe('');
});
