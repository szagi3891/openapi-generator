import { EndpointSpecType, JSONValue, OpenApiType } from '../type.ts';
import { getAllRefs } from './getAllRefs.ts';
import { getFirstPrefixFromRef, getFromRef } from '../isPrimitiveType.ts';
import { parseType } from '../parseType.ts';
import { getStructNameType, getStructNameZod } from '../refName.ts';
import { renderType } from './renderType.ts';

interface ContextRenderType {
    render: (ref: string, schema: OpenApiType) => Array<string>;
    join: (name: string, out: Array<string>) => string;
}

class RenderModels implements ContextRenderType {
    public render(ref: string, schema: OpenApiType): Array<string> {
        const out = [];

        const schemaZodName = getStructNameZod(ref);
        const schemaTypeName = getStructNameType(ref);

        out.push(`// ${ref}`);
        out.push(`export const ${schemaZodName} = ${renderType(0, schema)};`);
        out.push(`export type ${schemaTypeName} = z.TypeOf<typeof ${schemaZodName}>;`);
        out.push('');
        out.push('');

        return out;
    }

    public join(_name: string, out: Array<string>): string {
        const importZod = 'import { z } from \'zod\';';

        const outResult = [importZod, '', '', ...out];
        return outResult.join('\n');
    }
}

class ContextFileOutput {
    private readonly out: Array<string>;
    private readonly generatedModel: Set<string>;

    public constructor(private contextRender: ContextRenderType) {
        this.out = [];
        this.generatedModel = new Set();
    }

    public hasGenerated(ref: string): boolean {
        return this.generatedModel.has(ref);
    }

    public renderType(ref: string, schema: OpenApiType): void {
        this.generatedModel.add(ref);

        this.out.push(...this.contextRender.render(ref, schema));
    }

    public output(): Array<string> {
        return this.out;
    }
}

class ContextOutput {
    private readonly out: Map<string, ContextFileOutput>;

    public constructor(private contextRender: ContextRenderType) {
        this.out = new Map();
    }

    public getOrCreate(ref: string): ContextFileOutput {
        const prefix = getFirstPrefixFromRef(ref);
        
        const item = this.out.get(prefix);

        if (item !== undefined) {
            return item;
        }

        const newItem = new ContextFileOutput(this.contextRender);
        this.out.set(prefix, newItem);
        return newItem;
    }

    public output(): Map<string, string> {
        const out = new Map();

        for (const [prefix, context] of this.out) {
            out.set(prefix, this.contextRender.join(prefix, context.output()));
        }

        return out;
    }
}

const renderModelFromRef = (
    parent: Array<string>,
    context: ContextOutput,
    //pełna specyfiacja
    openApiSpec: JSONValue,
    //ścieka wzkazująca na model
    ref: string,
): void => {
    if (parent.includes(ref)) {
        throw Error('Cyclical dependency !!!!!!');
    }

    const contextRef = context.getOrCreate(ref);

    if (contextRef.hasGenerated(ref)) {
        return;
    }

    const schema = parseType(openApiSpec, getFromRef(openApiSpec, ref));

    for (const refChild of getAllRefs(schema)) {
        renderModelFromRef(
            [...parent, ref],
            context,
            openApiSpec,
            refChild
        );
    }

    contextRef.renderType(ref, schema);
};

export const renderModels = (
    //Pełna specyfikacja, z tego miejsca mozna brac kolejne ref-y
    openApiSpec: JSONValue,
    endpointDefList: Array<EndpointSpecType>
): Map<string, string> => {

    const context = new ContextOutput(new RenderModels());

    for (const endpoint of endpointDefList) {
        for (const param of endpoint.parameters) {
            for (const ref of getAllRefs(param.schema)) {
                renderModelFromRef([], context, openApiSpec, ref);
            }
        }

        for (const schema of Object.values(endpoint.responses)) {
            for (const ref of getAllRefs(schema)) {
                renderModelFromRef([], context, openApiSpec, ref);
            }
        }
    }

    return context.output();
};



class RenderImports implements ContextRenderType {
    public render(ref: string, _schema: OpenApiType): Array<string> {
        const out = [];

        const schemaZodName = getStructNameZod(ref);

        out.push(schemaZodName);

        return out;
    }

    public join(prefix: string, out: Array<string>): string {
        if (out.length === 0) {
            return '';
        }

        return [
            'import {',
            ...out.map((item) => `    ${item},`),
            `} from './${prefix}.ts';`
        ].join('\n');
    }
}

const getAllRefsFromEndpoint = (endpoint: EndpointSpecType): Array<string> => {
    const allRefs = [];

    for (const param of endpoint.parameters) {
        for (const ref of getAllRefs(param.schema)) {
            allRefs.push(ref);
        }
    }

    for (const schema of Object.values(endpoint.responses)) {
        for (const ref of getAllRefs(schema)) {
            allRefs.push(ref);
        }
    }

    return allRefs;
};

export const renderImports = (openApiSpec: JSONValue, endpoint: EndpointSpecType) : string => {
    const context = new ContextOutput(new RenderImports());

    for (const ref of getAllRefsFromEndpoint(endpoint)) {
        const contextRef = context.getOrCreate(ref);

        if (contextRef.hasGenerated(ref)) {
            continue;
        }

        const schema = parseType(openApiSpec, getFromRef(openApiSpec, ref));
        contextRef.renderType(ref, schema);
    }

    const importsOut = [];

    for (const importChunks of context.output().values()) {
        importsOut.push(importChunks);
    }
    return importsOut.join('\n');
};

