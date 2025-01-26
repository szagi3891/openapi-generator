import { z } from '../lib.ts';

const recordZod = z.record(z.string(), z.unknown());

export const filterXProprty = (data: unknown): unknown => {

    const safeData = recordZod.safeParse(data);

    if (safeData.success) {
        const result: Record<string, unknown> = {};
        for (const [name, value] of Object.entries(safeData.data)) {
            if (name.toLowerCase().startsWith('x-')) {
                //ignore
            } else {
                result[name] = value;
            }
        }

        return result;
    }

    return data;
};
