import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface CreateTestimonyProps {
  table: dynamodb.ITable; // Accept the table as a prop
}

export class Testimony extends Construct {
  public readonly createTestimonyLambda: lambda.IFunction;

  constructor(scope: Construct, id: string, props: CreateTestimonyProps) {
    super(scope, id);

    const TestimoniesTable = props.table;

    this.createTestimonyLambda = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: "./lambda/functions/testimony.function.ts",
      environment: {
        TESTIMONIES_TABLE_NAME: TestimoniesTable.tableName,
      },
    });

    // Grant Lambda permissions to the DynamoDB table
    TestimoniesTable.grantReadWriteData(this.createTestimonyLambda);
  }
}
