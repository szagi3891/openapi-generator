### launching without parameters

```
deno run -A --import-map=https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/import-map.json https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/main.ts
```

### launch with parameters

./example/spec_openapi.json - openapi specification

./example/target - files will be generated to this directory (this directory must contain the file `spec.json`)

```
deno run -A --import-map=https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/import-map.json https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/main.ts ./example/spec_openapi.json ./example/target
```

### Example contents of spec.json file

```json
{
    "blablabla": {
        "method": "get",
        "url": "/pets"
    }
}

```