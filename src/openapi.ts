import { SpecSourceType, JSONValue, EndpointSpecType } from './openapi/type.ts';
import fs from 'node:fs';
import { derefSchema, getFromObjectByPath } from './openapi/isPrimitiveType.ts';
import { parseEndpointSpec } from './openapi/parseEndpointSpec/parseEndpointSpec.ts';
import { renderEndpoint } from './openapi/render_template/renderEndpoint.ts';
import { toBigCamelCase } from './openapi/render_template/toBigCamelCase.ts';
import { renderModels } from './openapi/render_template/renderModels.ts';
import type { TargetSpec } from "./openapi/TargetSpec.ts";
import { assertNever } from "./lib.ts";



const getSpec = async (spec: SpecSourceType): Promise<JSONValue> => {
    if (spec.type === 'file') {
        console.info('spec.path', spec.path);

        const data = (await fs.promises.readFile(spec.path)).toString();

        const jsonData = JSON.parse(data);
        return jsonData;
        // if (jsonData.type === 'ok') {
        //     return jsonData.value;
        // }

        // throw Error('Parse problem');
    }

    if (spec.type === 'remote') {
        const response = await fetch(spec.json);

        if (response.status === 200) {
            const json = await response.json();
            return json;

        }
        throw Error(`Parse fetch problem ${spec.json}`);
    }

    return assertNever(spec);
};


export const taskGenerateOpenapi = async (
    requestedApiSpec: TargetSpec,
    spec: SpecSourceType
): Promise<void> => {
    console.info('');
    console.info('');
 
    const openApiSpec = derefSchema(await getSpec(spec));
    
    await requestedApiSpec.clearOldFiles();

    const endpointDefList: Array<EndpointSpecType> = [];

    for (const [methodAlias, def] of Object.entries(await requestedApiSpec.getTargetSpec())) {
        const endpoint = parseEndpointSpec(openApiSpec, getFromObjectByPath(openApiSpec, ['paths', def.url, def.method]));
        endpointDefList.push(endpoint);
        const fileName = `api${toBigCamelCase(methodAlias)}`;
        
        const template = renderEndpoint(openApiSpec, fileName, def.method, def.url, endpoint);
        
        const outFile = await requestedApiSpec.writeTemplate(fileName, template);
        console.info(`%cgenerated -> ${outFile}`, 'color: green;');
    }

    const modelsTemplate = renderModels(openApiSpec, endpointDefList);
    for (const [file, fileContent] of modelsTemplate) {
        const outFile = await requestedApiSpec.writeModels(`${file}.ts`, fileContent);
        console.info(`%cgenerated -> ${outFile}`, 'color: green;');    
    }

    console.info('');
    console.info('');
    console.info('%cEnd ...', 'background-color: green;');
    console.info('');
    console.info('');
};
