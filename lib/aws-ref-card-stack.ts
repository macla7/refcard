import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CreateTestimony } from "../lambda/createTestimony";

export class AwsRefCardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the DynamoDB Table
    const TestimoniesTable = new dynamodb.Table(this, "TestimoniesTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "Testimonies",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    // Pass the table as a prop to the CreateTestimony construct
    new CreateTestimony(this, "create-testimony", {
      table: TestimoniesTable,
    });

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRefCardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
