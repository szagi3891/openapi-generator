import { CheckByZod } from "../lib.ts";
import fs from 'node:fs';
import { z } from '../lib.ts';

const SpecDetailsZod = z.record(z.string(), z.object({
    url: z.string(),
    method: z.string(),
}))
const SpecDetailsCheck = new CheckByZod('SpecDetailsCheck', SpecDetailsZod);

export type SpecDetailsType = z.TypeOf<typeof SpecDetailsZod>;


export class TargetSpec {

    public constructor(public readonly target: string) {}

    public async getTargetSpec(): Promise<SpecDetailsType> {
        const specPath = `${this.target}/spec.json`;

        const specContent = (await fs.promises.readFile(specPath)).toString();
        const spec = SpecDetailsCheck.jsonParse(specContent);

        if (spec.type === 'ok') {
            return spec.data;
        } else {
            throw Error(`${specPath} => ${spec.error}`);
        }
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
