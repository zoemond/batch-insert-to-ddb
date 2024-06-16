import { Command } from "commander";
import { batchInsert } from "./batch-insert";

const program = new Command();

program.version("0.0.1");

program
  .description("upload csv to dynamodb")
  .requiredOption("--query-response-json <inputJson>", "input json file")
  .requiredOption("--table-name <tableName>", "table name")
  .action(async (options) => {
    await batchInsert(options.queryResponseJson, options.tableName);
  });

program.parse();
