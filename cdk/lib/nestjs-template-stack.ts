import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';
import { Construct } from 'constructs';

interface NestjsTemplateStackProps extends cdk.StackProps {
  environment: string;
  appName: string;
}

export class NestjsTemplateStack extends cdk.Stack {
  private api: apigateway.RestApi;
  private lambdaRole: iam.Role;
  private lambdaSecurityGroup: ec2.SecurityGroup;
  private vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: NestjsTemplateStackProps) {
    super(scope, id, props);

    // Setup VPC for Lambda and RDS
    this.vpc = this.createVpc();

    // Create IAM role for Lambda functions
    this.lambdaRole = this.createLambdaRole();

    // Create security group for Lambda
    this.lambdaSecurityGroup = this.createLambdaSecurityGroup();

    // Setup RDS Database
    this.setupDatabase();

    // Create API Gateway
    this.api = this.createApiGateway();

    // Create Lambda functions and wire to API Gateway
    this.createAuthenticationHandlers();
    this.createUsersHandlers();
    this.createQuotationsHandlers();
    this.createComplainsHandlers();
    this.createContactUsHandlers();
    this.createLocalitiesHandlers();
    this.createLOVHandlers();
    this.createRolesHandlers();
    this.createCommonHandlers();

    // Output API endpoint
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.url,
      description: 'API Gateway endpoint URL',
    });
  }

  private createVpc(): ec2.Vpc {
    return new ec2.Vpc(this, 'AppVpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      natGateways: 1,
    });
  }

  private createLambdaRole(): iam.Role {
    const role = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role for Lambda functions',
    });

    // Add basic Lambda execution permissions
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaVPCAccessExecutionRole',
      ),
    );

    // Add CloudWatch Logs permissions
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: ['arn:aws:logs:*:*:*'],
      }),
    );

    // Add Secrets Manager access for DB credentials
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: ['arn:aws:secretsmanager:*:*:secret:*'],
      }),
    );

    return role;
  }

  private createLambdaSecurityGroup(): ec2.SecurityGroup {
    const sg = new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });

    return sg;
  }

  private setupDatabase(): void {
    const dbSecurityGroup = new ec2.SecurityGroup(
      this,
      'DatabaseSecurityGroup',
      {
        vpc: this.vpc,
        description: 'Security group for RDS database',
        allowAllOutbound: false,
      },
    );

    // Allow Lambda to connect to RDS
    dbSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Lambda to connect',
    );

    // Create RDS instance
    new rds.DatabaseInstance(this, 'PostgresDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      allocatedStorage: 20,
      storageType: rds.StorageType.GP2,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [dbSecurityGroup],
      databaseName: 'nestjs_db',
      multiAz: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }

  private createApiGateway(): apigateway.RestApi {
    const api = new apigateway.RestApi(this, 'NestjsTemplateApi', {
      restApiName: 'NestJS Template API',
      description: 'API Gateway for NestJS Lambda functions',
      deployOptions: {
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
    });

    return api;
  }

  private createLambdaFunction(
    name: string,
    handler: string,
    environment?: Record<string, string>,
  ): lambda.Function {
    return new lambda.Function(this, name, {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../dist/src/lambda'),
      ),
      handler: `handlers/${handler}.handler`,
      role: this.lambdaRole,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [this.lambdaSecurityGroup],
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        APP_ENV: 'PROD',
        ...environment,
      },
    });
  }

  private createAuthenticationHandlers(): void {
    const authResource = this.api.root.addResource('authentication');

    const signUpHandler = this.createLambdaFunction(
      'SignUpHandler',
      'authentication/sign-up',
    );
    authResource
      .addResource('sign-up')
      .addMethod('POST', new apigateway.LambdaIntegration(signUpHandler));

    const signInHandler = this.createLambdaFunction(
      'SignInHandler',
      'authentication/sign-in',
    );
    authResource
      .addResource('sign-in')
      .addMethod('POST', new apigateway.LambdaIntegration(signInHandler));

    const refreshTokenHandler = this.createLambdaFunction(
      'RefreshTokenHandler',
      'authentication/refresh-token',
    );
    authResource
      .addResource('refresh-tokens')
      .addMethod('POST', new apigateway.LambdaIntegration(refreshTokenHandler));

    const forgotPasswordHandler = this.createLambdaFunction(
      'ForgotPasswordHandler',
      'authentication/forgot-password',
    );
    authResource
      .addResource('forgot-password')
      .addMethod(
        'POST',
        new apigateway.LambdaIntegration(forgotPasswordHandler),
      );

    const resetPasswordHandler = this.createLambdaFunction(
      'ResetPasswordHandler',
      'authentication/reset-password',
    );
    authResource
      .addResource('reset-password')
      .addMethod(
        'POST',
        new apigateway.LambdaIntegration(resetPasswordHandler),
      );
  }

  private createUsersHandlers(): void {
    const usersResource = this.api.root.addResource('users');

    const createUserHandler = this.createLambdaFunction(
      'CreateUserHandler',
      'users/create-user',
    );
    usersResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createUserHandler),
    );

    const listUsersHandler = this.createLambdaFunction(
      'ListUsersHandler',
      'users/list-users',
    );
    usersResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listUsersHandler),
    );

    const userIdResource = usersResource.addResource('{id}');

    const getUserHandler = this.createLambdaFunction(
      'GetUserHandler',
      'users/get-user',
    );
    userIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getUserHandler),
    );

    const updateUserHandler = this.createLambdaFunction(
      'UpdateUserHandler',
      'users/update-user',
    );
    userIdResource.addMethod(
      'PATCH',
      new apigateway.LambdaIntegration(updateUserHandler),
    );

    const deleteUserHandler = this.createLambdaFunction(
      'DeleteUserHandler',
      'users/delete-user',
    );
    userIdResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteUserHandler),
    );

    const deleteUsersHandler = this.createLambdaFunction(
      'DeleteUsersHandler',
      'users/delete-many-users',
    );
    usersResource
      .addResource('delete')
      .addMethod('POST', new apigateway.LambdaIntegration(deleteUsersHandler));
  }

  private createQuotationsHandlers(): void {
    const quotationsResource = this.api.root.addResource('quotations');

    const createHandler = this.createLambdaFunction(
      'CreateQuotationHandler',
      'quotations/create-quotation',
    );
    quotationsResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createHandler),
    );

    const listHandler = this.createLambdaFunction(
      'ListQuotationsHandler',
      'quotations/list-quotations',
    );
    quotationsResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listHandler),
    );

    const quotationIdResource = quotationsResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetQuotationHandler',
      'quotations/get-quotation',
    );
    quotationIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );

    const updateHandler = this.createLambdaFunction(
      'UpdateQuotationHandler',
      'quotations/update-quotation',
    );
    quotationIdResource.addMethod(
      'PATCH',
      new apigateway.LambdaIntegration(updateHandler),
    );

    const deleteHandler = this.createLambdaFunction(
      'DeleteQuotationHandler',
      'quotations/delete-quotation',
    );
    quotationIdResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteHandler),
    );

    const deleteAllHandler = this.createLambdaFunction(
      'DeleteManyQuotationsHandler',
      'quotations/delete-many-quotations',
    );
    quotationsResource
      .addResource('delete')
      .addMethod('POST', new apigateway.LambdaIntegration(deleteAllHandler));
  }

  private createComplainsHandlers(): void {
    const complainsResource = this.api.root.addResource('complains');

    const createHandler = this.createLambdaFunction(
      'CreateComplainHandler',
      'complains/create-complain',
    );
    complainsResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createHandler),
    );

    const listHandler = this.createLambdaFunction(
      'ListComplainsHandler',
      'complains/list-complains',
    );
    complainsResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listHandler),
    );

    const complainIdResource = complainsResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetComplainHandler',
      'complains/get-complain',
    );
    complainIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );

    const updateHandler = this.createLambdaFunction(
      'UpdateComplainHandler',
      'complains/update-complain',
    );
    complainIdResource.addMethod(
      'PATCH',
      new apigateway.LambdaIntegration(updateHandler),
    );

    const deleteHandler = this.createLambdaFunction(
      'DeleteComplainHandler',
      'complains/delete-complain',
    );
    complainIdResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteHandler),
    );
  }

  private createContactUsHandlers(): void {
    const contactUsResource = this.api.root.addResource('contact-us');

    const createHandler = this.createLambdaFunction(
      'CreateContactUsHandler',
      'contact-us/create-contact-us',
    );
    contactUsResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createHandler),
    );

    const listHandler = this.createLambdaFunction(
      'ListContactUsHandler',
      'contact-us/list-contact-us',
    );
    contactUsResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listHandler),
    );

    const contactIdResource = contactUsResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetContactUsHandler',
      'contact-us/get-contact-us',
    );
    contactIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );

    const deleteHandler = this.createLambdaFunction(
      'DeleteContactUsHandler',
      'contact-us/delete-contact-us',
    );
    contactIdResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteHandler),
    );
  }

  private createLocalitiesHandlers(): void {
    const localitiesResource = this.api.root.addResource('localities');

    const listHandler = this.createLambdaFunction(
      'ListLocalitiesHandler',
      'localities/list-localities',
    );
    localitiesResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listHandler),
    );

    const localityIdResource = localitiesResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetLocalityHandler',
      'localities/get-locality',
    );
    localityIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );
  }

  private createLOVHandlers(): void {
    const lovResource = this.api.root.addResource('lov');

    const listHandler = this.createLambdaFunction(
      'ListLOVHandler',
      'lov/list-lov',
    );
    lovResource.addMethod('GET', new apigateway.LambdaIntegration(listHandler));

    const lovIdResource = lovResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetLOVHandler',
      'lov/get-lov',
    );
    lovIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );
  }

  private createRolesHandlers(): void {
    const rolesResource = this.api.root.addResource('roles');

    const listHandler = this.createLambdaFunction(
      'ListRolesHandler',
      'roles/list-roles',
    );
    rolesResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listHandler),
    );

    const roleIdResource = rolesResource.addResource('{id}');

    const getHandler = this.createLambdaFunction(
      'GetRoleHandler',
      'roles/get-role',
    );
    roleIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getHandler),
    );
  }

  private createCommonHandlers(): void {
    // Common handlers can be added here as needed
  }
}
