# GitHub Action: Upload protobuf message files to Confluent Schema Registry

## Inputs

### `url`

**Required**. Schema Registry Url

### `glob`

**Required**. Glob pattern to find relevant protobuf files to upload.

### `username`

**Required**. Schema Registry

### `glob`

**Required**. Glob pattern to find relevant protobuf files to upload.

## Required Embedded topic

The upload script requires `.proto` files to define a `topic` option. This will be used as the subject when uploading to the schema registry.

```protobuf
syntax = "proto3";

message ExampleMessage {

  option topic = "BusuuExampleEvent";

  string message = 1;
  string extra = 2;
}
```

## Example workflow

```yml
name: Upload Protobuf Schemas
on:
  push:
    branches:
      - master
  pull_request:
jobs:
  upload:
    name: Upload protobuf files to schema regsitry
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: upload
        uses: busuu/protobuf-schema-registry-upload@v1
        with:
          glob: './**/**.proto'
          url: ${{ secrets.CONFLUENT_CLOUD_SCHEMA_REGISTRY_URL }}
          username: ${{ secrets.CONFLUENT_CLOUD_SCHEMA_REGISTRY_USERNAME }}
          password: ${{ secrets.CONFLUENT_CLOUD_SCHEMA_REGISTRY_PASSWORD }}
```

## Updating this action

```bash
$ npm run package
$ git add dist
$ git commit -a -m "Update"
$ git push origin releases/v1
```
