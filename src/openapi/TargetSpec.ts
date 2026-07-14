import { CheckByZod } from "../lib.ts";
import fs from 'node:fs';
import { z } from '../lib.ts';

const CredentialsZod = z.enum(['omit', 'same-origin', 'include']);

const EndpointDefZod = z.object({
    url: z.string(),
    method: z.string(),
});

const SpecDetailsZod = z.object({
    credentials: CredentialsZod.default('omit'),
    endpoints: z.record(z.string(), EndpointDefZod),
});
const SpecDetailsCheck = CheckByZod.create('SpecDetailsCheck', SpecDetailsZod);

export type CredentialsType = z.TypeOf<typeof CredentialsZod>;
export type SpecDetailsType = z.TypeOf<typeof SpecDetailsZod>;

type TargetSpecValidationError = {
    description?: string | Array<string>;
    errors?: Array<{ field: string; message: string }>;
    data?: unknown;
};

const EXAMPLE_SPEC = `{
    "credentials": "omit",
    "endpoints": {
        "myEndpoint": {
            "method": "get",
            "url": "/pets"
        }
    }
}`;

const formatHighlightedSpecPath = (specPath: string): string => {
    return `\u001b[4m\u001b[32m${specPath}\u001b[0m`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const looksLikeOldSpecFormat = (data: unknown): boolean => {
    if (!isRecord(data) || 'endpoints' in data) {
        return false;
    }

    const values = Object.values(data);
    if (values.length === 0) {
        return false;
    }

    return values.every((value) => {
        if (!isRecord(value)) {
            return false;
        }

        return typeof value['method'] === 'string' && typeof value['url'] === 'string';
    });
};

const formatTargetSpecError = (specPath: string, error: TargetSpecValidationError): string => {
    const lines: string[] = [
        `Invalid ${formatHighlightedSpecPath(specPath)}`,
        '',
    ];

    if (looksLikeOldSpecFormat(error.data)) {
        lines.push('It looks like you are using the old spec.json format.');
        lines.push('Wrap endpoint definitions under "endpoints".');
        lines.push('');
    }

    const validationErrors = error.errors ?? [];

    if (validationErrors.length > 0) {
        lines.push('Validation errors:');

        for (const item of validationErrors) {
            if (item.field === '---' && item.message.includes('Parsing error')) {
                lines.push('- The file is not valid JSON. Check syntax, quotes, and trailing commas.');
            } else {
                lines.push(`- ${item.field}: ${item.message}`);
            }
        }

        lines.push('');
    }

    if (validationErrors.some((item) => item.field === 'credentials')) {
        lines.push('Allowed values for "credentials": "omit" (default), "same-origin", "include".');
        lines.push('');
    }

    if (validationErrors.some((item) => item.field === 'endpoints')) {
        lines.push('The "endpoints" field is required and must be an object with endpoint aliases as keys.');
        lines.push('');
    }

    lines.push('Expected spec.json shape:');
    lines.push(EXAMPLE_SPEC);

    return lines.join('\n');
};

export const parseTargetSpecJson = (specContent: string, specPath = 'spec.json'): SpecDetailsType => {
    const spec = SpecDetailsCheck.jsonParse(specContent);
    if (spec.type === 'ok') {
        return spec.data;
    }
    throw Error(formatTargetSpecError(specPath, spec.error));
};


export class TargetSpec {

    public constructor(public readonly target: string) {}

    public async getTargetSpec(): Promise<SpecDetailsType> {
        const specPath = `${this.target}/spec.json`;

        const specContent = (await fs.promises.readFile(specPath)).toString();
        return parseTargetSpecJson(specContent, specPath);
    }

    public async writeTemplate(fileName: string, template: string): Promise<string> {
        const filePath = `${this.target}/${fileName}.ts`;
        await fs.promises.writeFile(filePath, template);

        return filePath;
    }

    public async writeModels(file: string, modelsTemplate: string): Promise<string> {
        if (file.toLocaleLowerCase().startsWith('api')) {
            throw Error('The fixed component file must not start with the prefix api');
        }

        const filePath = `${this.target}/${file}`;
        await fs.promises.writeFile(filePath, modelsTemplate);
        return filePath;
    }

    public async clearOldFiles(): Promise<void> {
        const specPath = `${this.target}`;

        for (const item of await fs.promises.readdir(specPath)) {
            const itemPath = `${specPath}/${item}`;

            const stat = await fs.promises.stat(itemPath);

            if (stat.isFile()) {
                if (item === 'spec.json') {
                    //this file stays
                } else {
                    await fs.promises.unlink(itemPath);
                }

                continue;
            }

            if (stat.isDirectory()) {
                throw Error(`There should not be a directory here path=${itemPath}`);
            }

            // this.command.panic(`unknown type: path=${itemPath}`);
            throw Error(`unknown type: path=${itemPath}`);
        }
    }
}
