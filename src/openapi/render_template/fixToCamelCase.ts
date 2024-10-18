const firstLetterToUp = (name: string): string => {
    const out: string[] = [];

    for (let key = 0; key < name.length; key++) {
        const char = name[key];
        if (char === undefined) {
            throw Error('Expected string');
        }

        if (key === 0) {
            for (const char2 of char.toUpperCase()) {
                out.push(char2);
            }
        } else {
            out.push(char);
        }
    }

    return out.join('');
};

export const fixToCamelCase = (paramName: string): string => {
    const out: string[] = [];

    const chunks = paramName.split('-');

    for (let key = 0; key < chunks.length; key++) {
        const item = chunks[key];
        if (item === undefined) {
            throw Error('Expected string');
        }

        if (key === 0) {
            out.push(item);
        } else {
            out.push(firstLetterToUp(item));
        }
    }

    return out.join('');
};

