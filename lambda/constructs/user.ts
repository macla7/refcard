import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface UserProps {
  table: dynamodb.ITable; // Accept the table as a prop
}

export class User extends Construct {
  public readonly userLambda: lambda.IFunction;

  constructor(scope: Construct, id: string, props: UserProps) {
    super(scope, id);

    const UsersTable = props.table;

    this.userLambda = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: "./lambda/functions/user.function.ts",
      environment: {
        USERS_TABLE_NAME: UsersTable.tableName,
      },
    });

    // Grant Lambda permissions to the DynamoDB table
    UsersTable.grantReadWriteData(this.userLambda);
  }
}
