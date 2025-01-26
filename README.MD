### generate js methods based on openapi specification

```sh
deno run -A --reload https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/main.ts ./example/spec_openapi.json ./example/target
```

- ./example/spec_openapi.json - openapi specification
- ./example/target - files will be generated to this directory (this directory must contain the file `spec.json`)

### Example contents of target/spec.json file

```json
{
    "blablabla": {
        "method": "get",
        "url": "/pets"
    }
}

```
