import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { CreateItem } from "./createItem";

export class AwsRefCardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Lambda Function
    // const createItemLambda = new lambda.Function(this, "CreateItemLambda", {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   code: lambda.Code.fromAsset("lambda"), // Directory for your Lambda code
    //   handler: "createItem.handler",
    //   environment: {
    //     USERS_TABLE_NAME: itemsTable.tableName,
    //   },
    // });

    new CreateItem(this, "create-item-boi");

    // // API Gateway
    // const api = new apigateway.RestApi(this, "RefCardApi", {
    //   restApiName: "RefCard Service",
    // });

    // const users = api.root.addResource("items");
    // users.addMethod("PUT", new apigateway.LambdaIntegration(createItemLambda));

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRefCardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
