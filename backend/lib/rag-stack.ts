import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export class RagStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiSecret = process.env.RAG_API_SECRET;
    if (!apiSecret) {
      throw new Error('RAG_API_SECRET env var must be set during deploy');
    }

    // CloudWatch log group for Lambda
    const logGroup = new logs.LogGroup(this, 'RagLambdaLogs', {
      logGroupName: '/kanbalio/rag-chat',
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function
    const ragFn = new lambda.Function(this, 'RagChatFunction', {
      functionName: 'kanbalio-rag-chat',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      logGroup,
      environment: {
        API_SECRET: apiSecret,
        AWS_REGION_NAME: 'us-east-1',
      },
    });

    // Bedrock permissions: Titan Embeddings V2 + Nova Lite (Amazon models, no marketplace needed)
    ragFn.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: [
        `arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0`,
        `arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0`,
      ],
    }));

    // HTTP API
    const api = new apigwv2.HttpApi(this, 'RagApi', {
      apiName: 'kanbalio-rag-api',
      corsPreflight: {
        allowOrigins: ['https://pjpangilinan.github.io'],
        allowMethods: [apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
        allowHeaders: ['Content-Type', 'X-Portfolio-Key'],
        maxAge: cdk.Duration.hours(1),
      },
      defaultAuthorizer: undefined,
    });

    // Throttle via default stage settings
    const defaultStage = api.defaultStage?.node.defaultChild as apigwv2.CfnStage;
    if (defaultStage) {
      defaultStage.defaultRouteSettings = {
        throttlingRateLimit: 5,
        throttlingBurstLimit: 10,
      };
    }

    // Route: POST /chat
    api.addRoutes({
      path: '/chat',
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration('RagIntegration', ragFn),
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url ?? 'undefined',
      description: 'RAG API base URL — set as RAG_API_URL GitHub secret',
      exportName: 'KanbalioRagApiUrl',
    });
  }
}
