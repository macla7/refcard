import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface ApiGatewayProps {
  httpApi: apigatewayv2.HttpApi; // Accept a pre-existing API Gateway
  lambda: lambda.IFunction;
  routeName: string;
}

export class CustomApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const { httpApi, lambda, routeName } = props;

    // Lambda Integration
    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      "LambdaIntegration",
      lambda
    );

    // Define routes
    httpApi.addRoutes({
      path: `/${routeName}`,
      methods: [apigatewayv2.HttpMethod.PUT, apigatewayv2.HttpMethod.GET],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: `/${routeName}/{id}`,
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.DELETE],
      integration: lambdaIntegration,
    });
  }
}
