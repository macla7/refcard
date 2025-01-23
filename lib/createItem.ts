import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class CreateItem extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB Table
    const itemsTable = new dynamodb.Table(this, "ItemsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "Items",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    const createItemFunction = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: "./lambda/createItem.function.ts",
      environment: {
        USERS_TABLE_NAME: itemsTable.tableName,
      },
    });

    // Grant Lambda permissions to the DynamoDB table
    itemsTable.grantReadWriteData(createItemFunction);

    // new LambdaRestApi(this, "api-ref-card-baby", {
    //   handler: createItemFunction,
    // });

    // HTTP API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, "RefCardHttpApi", {
      apiName: "RefCardService",
    });

    // Integrate Lambda with HTTP API
    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      "LambdaIntegration",
      createItemFunction
    );

    // Add Routes
    httpApi.addRoutes({
      path: "/items",
      methods: [apigatewayv2.HttpMethod.PUT, apigatewayv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: "/items/{id}",
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.DELETE],
      integration: lambdaIntegration,
    });

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: httpApi.url!,
    });
  }
}
