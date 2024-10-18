export const wordFirstLetterToUpper = (word: string): string => {
    const [firstChar, ...chars] = word.split('');
    return [(firstChar ?? '').toUpperCase(), ...chars].join('');
};

export const wordFirstLetterToLower = (word: string): string => {
    const [firstChar, ...chars] = word.split('');
    return [(firstChar ?? '').toLowerCase(), ...chars].join('');
};

export const toBigCamelCase = (name: string): string => {
    return name
        .split('_')
        .map(word => wordFirstLetterToUpper(word))
        .join('');
};

