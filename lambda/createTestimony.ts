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

export class CreateTestimony extends Construct {
  constructor(scope: Construct, id: string, props: CreateTestimonyProps) {
    super(scope, id);

    const TestimoniesTable = props.table;

    const createTestimonyFunction = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: "./lambda/createTestimony.function.ts",
      environment: {
        USERS_TABLE_NAME: TestimoniesTable.tableName,
      },
    });

    // Grant Lambda permissions to the DynamoDB table
    TestimoniesTable.grantReadWriteData(createTestimonyFunction);

    // new LambdaRestApi(this, "api-ref-card-baby", {
    //   handler: createTestimonyFunction,
    // });

    // DOES THIS NEED TO GO IN ANOTHER FILE/DIRECTORY????
    // HTTP API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, "RefCardHttpApi", {
      apiName: "RefCardService",
    });

    // Integrate Lambda with HTTP API
    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      "LambdaIntegration",
      createTestimonyFunction
    );

    // Add Routes
    httpApi.addRoutes({
      path: "/testimonies",
      methods: [apigatewayv2.HttpMethod.PUT, apigatewayv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: "/testimonies/{id}",
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.DELETE],
      integration: lambdaIntegration,
    });

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: httpApi.url!,
    });
  }
}
