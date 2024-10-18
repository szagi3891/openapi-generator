import { convertRefPart } from './isPrimitiveType.ts';

const upperFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getStructNameSufiks = (ref: string, suffix: string): string => {
    // '#/components/schemas/CreateSessionResponse'
    
    const chunks = convertRefPart(ref);

    const last = chunks.pop();

    if (last === undefined) {
        throw new Error(`expected not empty ref => "${ref}"`);
    }

    const lastTrim = last.trim();
    if (lastTrim === '') {
        throw new Error(`expected not empty ref => "${ref}"`);
    }

    return `${upperFirstLetter(last)}${suffix}`;
};


export const getStructNameZod = (ref: string): string => getStructNameSufiks(ref, 'Zod');
export const getStructNameType = (ref: string): string => getStructNameSufiks(ref, 'Type');

