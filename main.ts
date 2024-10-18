import { taskGenerateOpenapi } from "./src/openapi.ts";
import { TargetSpec } from "./src/openapi/TargetSpec.ts";
import type { SpecSourceType } from "./src/openapi/type.ts";

const [openapiSpec, target] = Deno.args;

if (openapiSpec === undefined || target === undefined) {
    throw Error('two parameters were expected');
}

console.info('args', Deno.args);

const request: TargetSpec = new TargetSpec(target);

const spec: SpecSourceType = {
    type: 'file',
    'path': openapiSpec
};

await taskGenerateOpenapi(request, spec);
