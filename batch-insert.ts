import fs from "fs";
import {
  BatchWriteItemCommand,
  AttributeValue,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

const DYNAMO_DB_BATCH_SIZE = 25;
const ddb = new DynamoDBClient();

type Item = Record<string, AttributeValue>;

export async function batchInsert(jsonFilename: string, tableName: string) {
  const chunkedItemsList = toChunkedItems<Item>(jsonFilename);

  for (let i = 0; i < chunkedItemsList.length; i++) {
    const items = chunkedItemsList[i];
    const command = newBatchWriteItemCommand(tableName, items);
    await ddb.send(command);
    console.log("Success chunk #" + i);
  }

  console.log("all data imported....");
}

function newBatchWriteItemCommand(tableName: string, items: Item[]) {
  return new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: items.map(toPutRequest),
    },
  });
}
function toPutRequest(item: Item) {
  return { PutRequest: { Item: item } };
}

function toChunkedItems<T>(jsonFilename: string) {
  const buffer = fs.readFileSync(jsonFilename);
  const json: { Items: T[] } = JSON.parse(buffer.toString());

  return chunk(json.Items, DYNAMO_DB_BATCH_SIZE);
}

function chunk<T>(array: T[], size: number) {
  const localArray = array.slice(0);
  const results: T[][] = [];
  while (localArray.length) results.push(localArray.splice(0, size));
  return results;
}
