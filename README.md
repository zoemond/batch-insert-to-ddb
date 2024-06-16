# Batch Insert To DynamoDB

batch insert data from a JSON file into an AWS DynamoDB table.

# How To Use

For example, it can be used to extract data from a table restored using Point-in-Time Recovery (PITR) and re-insert it into the original table.

1. Setup

```
git clone git@github.com:zoemond/batch-insert-to-ddb.git
cd batch-insert-to-ddb
npm i
```

2. Query the data you want to recover.

```sh
aws dynamodb query \
  --table-name Recovered-UserTable \
  --index-name byOrganization \
  --key-condition-expression "organizationId = :id" --expression-attribute-values "{\":id\":{\"S\":\"01234567-0000-4321-1234-012345678910\"}}" \
  --no-paginate \
  > query-response.json
```

3. Use the following command to insert data into the original table:

```sh
AWS_PROFILE=my-profile-name \
  npx ts-node index.ts --query-response-json ./query-response.json --table-name UserTable
```

# Not Implemented

- import from csv.
- send requests concurrently.
