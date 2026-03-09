# Integrations

## Get all integrations

```sh
curl --request GET \
  --url http://localhost:1409/integrations
```

### Responses

#### With integrations

Status: `200 OK`

```json
[
  {
    "name": "dd-one",
    "type": "datadog"
  },
  {
    "name": "otlp-http-one",
    "type": "otlphttp"
  },
  {
    "name": "otlp-grpc-one",
    "type": "otlpgrpc"
  }
]
```

#### No integrations or no secret

Status: `200 OK`

```json
[]
```

#### No gateway url

Status: `400 BAD REQUEST`

#### Else

Status: `500 SERVER ERROR`

## Create/Replace Integration

#### For Datadog

```sh
curl --request PUT \
 --url http://localhost:1409/integrations/datadog/dd-int-one \
 --header 'Content-Type: application/json' \
 --data '{
  "apiKey": "asdf",
  "ddUrl": "qwer"
}'
```

#### For OTLP HTTP (similar for GRPC)

```sh
curl --request PUT \
 --url http://localhost:1409/integrations/otlphttp/otlp-one \
 --header 'Content-Type: application/json' \
 --data '{
  "url": "asdf",
}'
```

### Responses

#### Success

Status: `200 OK`

#### No JSON, bad JSON, or JSON contract does not correspond to given type

Status: `400 BAD REQUEST`

#### Else

Status: `500 SERVER ERROR`

## Delete Integration

```sh
curl --request DELETE \
 --url http://localhost:1409/integrations/datadog/dd-int-one
```

### Responses

#### Success

Status: `200 OK`

### Does not exist

Status: `404 NOT FOUND`

### Else

Status: `500 SERVER ERROR`

# Connections

## Get Connections

```sh
curl --request GET \
 --url http://localhost:1409/connections
```

### Responses

#### With connections existing

Status: `200 OK`

```json
[
  {
    "name": "datadog-connection-1"
  }
]
```

#### No connections exist

Status: `200 OK`

```json
[]
```

#### No gateway url

Status: `400 BAD REQUEST`

#### Else

Status: `500 SERVER ERROR`

## Create/Replace Connection

```sh
curl --request PUT \
 --url http://localhost:1409/connections/foobarbaz-foo \
 --header 'Content-Type: application/json' \
 --data '{
  "receives": [
    {
      "type": "datadog",
      "dataTypes": [
        "metrics",
        "logs"
      ]
    }
  ],
  "exports": [
    {
      "type": "datadog",
      "integrations": [
        {
          "type": "datadog",
          "name": "dd-int-one"
        }
      ]
    }
  ],
  "deployment": {
    "type": "argocd",
    "data": {
      "branch": "baz/barfoo"
    }
  }
}'
```

### Responses

#### Success

Status: `200 OK`

#### No JSON, bad JSON, or JSON contract does not correspond to given type

Status: `400 BAD REQUEST`

#### Else

Status: `500 SERVER ERROR`

## Delete Connection

```sh
curl --request DELETE \
 --url http://localhost:1409/connections/foobarbaz-foo
```

### Responses

#### Success

Status: `200 OK`

### Does not exist

Status: `404 NOT FOUND`

### Else

Status: `500 SERVER ERROR`
