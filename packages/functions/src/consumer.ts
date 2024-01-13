import { test } from "@flashmap/core";
import { dbAws as db} from "@flashmap/core/db/aws";
import { SQSEvent } from "aws-lambda";

export async function main(event: SQSEvent) {
  const records: any[] = event.Records;
  console.log(`Message processed: "${records[0].body}"`);
  const input = JSON.parse(records[0].body)
  await db.insert(test).values({
    test: `Created from Queue: ${input.message}`
  });

  return {};
}
