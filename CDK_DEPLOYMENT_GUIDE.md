# CDK Deployment Guide

This guide explains how to build and deploy your NestJS application as AWS Lambda functions orchestrated with API Gateway using AWS CDK.

## Project Structure

```
cdk/
├── bin/
│   └── app.ts                 # CDK app entry point
├── lib/
│   └── nestjs-template-stack.ts  # Main CDK stack
├── cdk.json                   # CDK configuration
└── tsconfig.json             # TypeScript configuration

src/lambda/
├── handlers/                  # Lambda handler functions
│   ├── authentication/
│   ├── users/
│   ├── quotations/
│   ├── complains/
│   ├── contact-us/
│   ├── localities/
│   ├── lov/
│   └── roles/
└── utils/
    └── lambda-response.ts     # Lambda response formatting utilities
```

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI
3. **Node.js**: Version 20+ required
4. **CDK CLI**: Install AWS CDK CLI globally

```bash
npm install -g aws-cdk
```

## Installation

1. Install project dependencies:

```bash
npm install
```

2. Install CDK dependencies:

```bash
npm install aws-cdk-lib constructs
```

## Configuration

### Environment Variables

Create `.env.production` file:

```env
APP_ENV=PROD
JWT_SECRET=your-secret-key
JWT_TOKEN_AUDIENCE=your-audience
JWT_TOKEN_ISSUER=your-issuer
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=604800
DATABASE_HOST=<RDS-ENDPOINT>
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=<YOUR-PASSWORD>
DATABASE_NAME=nestjs_db
SENDGRID_API_KEY=<YOUR-SENDGRID-KEY>
TWILIO_ACCOUNT_SID=<YOUR-TWILIO-SID>
TWILIO_AUTH_TOKEN=<YOUR-TWILIO-TOKEN>
```

### AWS CDK Context

Update `cdk/cdk.json` for your environment:

```json
{
  "context": {
    "environment": "dev",
    "appName": "nestjs-template"
  }
}
```

## Building

### 1. Build the NestJS application

```bash
npm run build
```

This compiles TypeScript and prepares the application code.

### 2. Build Lambda handlers

The Lambda handlers are built as part of the NestJS build process. They're located in `src/lambda/handlers/`.

### 3. Synthesize CDK stack

```bash
cdk synth
```

This generates CloudFormation templates in the `cdk.out` directory.

## Deployment

### 1. Bootstrap AWS Account (First time only)

If this is your first time using CDK in this AWS account/region:

```bash
cdk bootstrap aws://ACCOUNT_ID/REGION
```

Example:

```bash
cdk bootstrap aws://123456789012/us-east-1
```

### 2. Deploy the stack

```bash
cdk deploy
```

This will:

- Create a VPC with public and private subnets
- Create security groups for Lambda and RDS
- Create an RDS PostgreSQL database instance
- Create Lambda functions for each handler
- Create and configure API Gateway
- Wire Lambda functions to API Gateway routes

### 3. Run database migrations

After deployment, the RDS endpoint will be available. Update your database credentials and run:

```bash
npm run migration:run:prod
```

## API Endpoints

After successful deployment, the API endpoints will be available at the API Gateway URL:

### Authentication

- `POST /authentication/sign-up` - Register new user
- `POST /authentication/sign-in` - Login
- `POST /authentication/refresh-tokens` - Refresh access token
- `POST /authentication/forgot-password` - Request password reset
- `POST /authentication/reset-password` - Reset password with token

### Users (Admin only for create/delete)

- `GET /users` - List users with pagination
- `POST /users` - Create new user
- `GET /users/{id}` - Get user by ID
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/delete` - Delete multiple users

### Quotations

- `GET /quotations` - List quotations
- `POST /quotations` - Create quotation
- `GET /quotations/{id}` - Get quotation
- `PATCH /quotations/{id}` - Update quotation
- `DELETE /quotations/{id}` - Delete quotation
- `POST /quotations/delete` - Delete multiple quotations

### Complains

- `GET /complains` - List complains
- `POST /complains` - Create complain
- `GET /complains/{id}` - Get complain
- `PATCH /complains/{id}` - Update complain
- `DELETE /complains/{id}` - Delete complain

### Contact Us

- `GET /contact-us` - List contact requests
- `POST /contact-us` - Create contact request
- `GET /contact-us/{id}` - Get contact request
- `DELETE /contact-us/{id}` - Delete contact request

### Localities

- `GET /localities` - List localities
- `GET /localities/{id}` - Get locality

### LOV (List of Values)

- `GET /lov` - List LOV items
- `GET /lov/{id}` - Get LOV item

### Roles

- `GET /roles` - List roles
- `GET /roles/{id}` - Get role

## Monitoring & Logs

### CloudWatch Logs

Lambda logs are automatically sent to CloudWatch Logs. View logs:

```bash
# View logs for a specific Lambda function
aws logs tail /aws/lambda/nestjs-template-dev-stack-SignUpHandler -f

# View all logs
aws logs describe-log-groups --query 'logGroups[?contains(logGroupName, `nestjs-template`)].logGroupName' --output text
```

### CloudWatch Metrics

Monitor Lambda performance:

- Invocations
- Duration
- Errors
- Concurrent Executions

## Updating the Application

### 1. Make code changes

Edit controller logic in `src/lambda/handlers/`

### 2. Rebuild

```bash
npm run build
```

### 3. Update Lambda functions

```bash
cdk deploy
```

## Destroying Resources

To remove all AWS resources created by this stack:

```bash
cdk destroy
```

**Warning**: This will delete:

- Lambda functions
- API Gateway
- RDS database (with RemovalPolicy.DESTROY)
- VPC and security groups

## Troubleshooting

### Lambda function not found

Ensure the Lambda handler files exist and are properly named:

- File names must match handler paths in CDK stack
- Example: `src/lambda/handlers/authentication/sign-up.ts` with exported `handler` function

### Database connection timeout

- Check security group rules allow Lambda to access RDS on port 5432
- Verify database credentials in environment variables
- Ensure Lambda is in the same VPC as RDS

### API Gateway 502 errors

- Check Lambda logs in CloudWatch
- Verify Lambda response format matches expected API Gateway response structure
- Check Lambda timeout settings (currently 30 seconds)

### Out of memory errors

Increase Lambda memory in CDK stack:

```typescript
memorySize: 1024, // Increase from 512
```

## Cost Optimization

- **Lambda**: Pay per invocation (~$0.20 per million)
- **API Gateway**: ~$3.50 per million requests
- **RDS**: Pay for compute (t3.micro is eligible for free tier) and storage
- **Data Transfer**: Minimize cross-region data transfer

## Security Considerations

1. **Secrets Management**: Store sensitive data in AWS Secrets Manager
2. **VPC**: Lambda and RDS are in private subnets
3. **IAM Roles**: Lambda has minimal required permissions
4. **API Keys**: Implement API Gateway API keys for rate limiting
5. **CORS**: Configure CORS on API Gateway if needed

## Next Steps

1. **Implement Use Cases**: Complete the TODO comments in Lambda handlers with actual business logic
2. **Add Authorizers**: Implement JWT validation in API Gateway
3. **Add Custom Domain**: Attach custom domain to API Gateway
4. **Setup CI/CD**: Automate deployments with GitHub Actions or CodePipeline
5. **Add Monitoring**: Set up CloudWatch alarms for errors and performance

## Additional Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/latest/guide/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/)
- [RDS Documentation](https://docs.aws.amazon.com/rds/latest/userguide/)
