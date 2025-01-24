import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Testimony } from "../lambda/constructs/testimony";
import { CustomApiGateway } from "../api/CustomApiGateway";
import { User } from "../lambda/constructs/user";

export class AwsRefCardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the DynamoDB Table
    const TestimoniesTable = new dynamodb.Table(this, "TestimoniesTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "Testimonies",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    // Define the DynamoDB Table
    const UsersTable = new dynamodb.Table(this, "UsersTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "Users",
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT for production
    });

    // Pass the table as a prop to the CreateTestimony construct
    const TestimonyConstruct = new Testimony(this, "TestimonyConstruct", {
      table: TestimoniesTable,
    });

    // Pass the table as a prop to the CreateTestimony construct
    const UserConstruct = new User(this, "UserConstruct", {
      table: UsersTable,
    });

    const httpApi = new apigatewayv2.HttpApi(this, "RefCardHttpApi", {
      apiName: "RefCardService",
    });

    // Add routes for Testimonies
    new CustomApiGateway(this, "TestimoniesRoutes", {
      httpApi,
      lambda: TestimonyConstruct.createTestimonyLambda,
      routeName: "testimonies",
    });

    // Add routes for Users
    new CustomApiGateway(this, "UsersRoutes", {
      httpApi,
      lambda: UserConstruct.userLambda,
      routeName: "users",
    });

    // example resource
    // const queue = new sqs.Queue(this, 'AwsRefCardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
