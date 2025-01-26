### generate js methods based on openapi specification

- ./example/spec_openapi.json - openapi specification
- ./example/target - files will be generated to this directory (this directory must contain the file `spec.json`)

```sh
deno run -A \
https://raw.githubusercontent.com/szagi3891/openapi-generator/refs/heads/main/main.ts \
./example/spec_openapi.json \
./example/target
```

### Example contents of target/spec.json file

```json
{
    "blablabla": {
        "method": "get",
        "url": "/pets"
    }
}

```
