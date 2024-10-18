import { expect } from "@std/expect";
import { getStructNameType, getStructNameZod } from './refName.ts';

Deno.test('basic', () => {
    expect(getStructNameZod('#/components/schemas/CreateSessionResponse')).toBe('CreateSessionResponseZod');
    expect(getStructNameZod('#/components/schemas/createSessionResponse')).toBe('CreateSessionResponseZod');

    expect(getStructNameType('#/components/schemas/CreateSessionResponse')).toBe('CreateSessionResponseType');
    expect(getStructNameType('#/components/schemas/createSessionResponse')).toBe('CreateSessionResponseType');

    expect(() => getStructNameZod('')).toThrow('expected not empty ref => ""');
    expect(() => getStructNameZod('#')).toThrow('expected not empty ref => "#"');
    expect(() => getStructNameZod('#/')).toThrow('expected not empty ref => "#/"');
    expect(() => getStructNameZod('#/  ')).toThrow('expected not empty ref => "#/  "');
});

