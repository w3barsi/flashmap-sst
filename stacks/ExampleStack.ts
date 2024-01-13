import { Config, Queue, StackContext } from "sst/constructs";
import {Duration} from "aws-cdk-lib"

export function ExampleStack({ stack }: StackContext) {
  const DATABASE_URL = new Config.Secret(stack, "DATABASE_URL")
  // Create Queue
  const queue = new Queue(stack, "Queue", {
    consumer: {
      function: {
        handler: "packages/functions/src/consumer.main",
        timeout: 10
      }
    },
    cdk: {
      queue: {
        queueName: "flashmap-queue",
        visibilityTimeout: Duration.seconds(10)
      }
    }
  });
  queue.bind([DATABASE_URL])

  stack.addOutputs({
    QueueEndpoint: queue.queueUrl
  });
}
