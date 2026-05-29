import YAML from 'npm:yaml@^2.0.0';
import path from 'node:path';
import type { JSONValue } from './type.ts';

type SpecContentFormat = 'json' | 'yaml';

const getFormatFromPath = (filePath: string): SpecContentFormat => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.json') {
        return 'json';
    }

    if (ext === '.yaml' || ext === '.yml') {
        return 'yaml';
    }

    throw new Error(
        `Unsupported spec file extension "${ext}" in ${filePath}. Expected .json, .yaml or .yml`,
    );
};

export const parseContent = async (filePath: string, content: string): Promise<JSONValue> => {
    const format = getFormatFromPath(filePath);

    if (format === 'json') {
        try {
            return JSON.parse(content) as JSONValue;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to parse OpenAPI spec as JSON (${filePath}): ${message}`);
        }
    }

    try {
        return YAML.parse(content) as JSONValue;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse OpenAPI spec as YAML (${filePath}): ${message}`);
    }
};
