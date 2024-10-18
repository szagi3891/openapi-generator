import { expect } from "@std/expect";
import { fixToCamelCase } from './fixToCamelCase.ts';

Deno.test('fixToCamelCase', () => {

    expect(fixToCamelCase('ddd-aaa-ttt')).toBe('dddAaaTtt');
    expect(fixToCamelCase('aaa')).toBe('aaa');
});
