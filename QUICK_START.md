# Quick Start Guide - CDK Deployment

## 5-Minute Setup

### Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 20+ installed

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# 3. Bootstrap CDK (first time only)
npm run cdk:bootstrap

# 4. Build and deploy
npm run cdk:deploy

# 5. Wait for deployment (5-10 minutes)
# CDK will output the API Gateway URL at the end
```

### After Deployment

```bash
# Get the API endpoint
aws apigateway get-rest-apis --query 'items[?name==`NestjsTemplateApi`].id' --output text

# Test the API
curl -X POST https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/authentication/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "John",
    "lastname": "Doe"
  }'
```

## Common Commands

| Command                   | Purpose                           |
| ------------------------- | --------------------------------- |
| `npm run cdk:deploy`      | Deploy to dev environment         |
| `npm run cdk:deploy:prod` | Deploy to production              |
| `npm run cdk:destroy`     | Destroy dev stack                 |
| `npm run cdk:synth`       | Generate CloudFormation template  |
| `npm run cdk:diff`        | Show what will change             |
| `npm run cdk:watch`       | Watch for changes and auto-deploy |

## Environment Variables

Create `.env.production` for production deployment:

```env
APP_ENV=PROD
JWT_SECRET=your-secret-key-here
JWT_TOKEN_AUDIENCE=your-audience
JWT_TOKEN_ISSUER=your-issuer
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=604800
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## Troubleshooting

### Error: "AWS credentials not configured"

```bash
aws configure
```

### Error: "CDK bootstrap required"

```bash
npm run cdk:bootstrap
```

### Error: "Insufficient permissions"

- Check AWS IAM permissions for your user
- Ensure you have access to: Lambda, API Gateway, RDS, VPC, EC2, CloudFormation

### Error: "Timeout"

- Lambda timeout set to 30 seconds (configurable in CDK stack)
- Database queries may be too slow
- Check CloudWatch logs

## Monitoring

View Lambda logs:

```bash
aws logs tail /aws/lambda/nestjs-template-dev-stack-SignUpHandler -f
```

View all Lambda functions:

```bash
aws lambda list-functions --query 'Functions[?contains(FunctionName, `nestjs-template`)].FunctionName'
```

## Cost Estimates (Monthly)

- Lambda: ~$20 (1M invocations)
- API Gateway: ~$3.50 (1M requests)
- RDS: $30-50 (t3.micro)
- Data Transfer: $5-10
- **Total: ~$60-90/month**

## Documentation

For more details, see:

- [CDK_DEPLOYMENT_GUIDE.md](./CDK_DEPLOYMENT_GUIDE.md)
- [CDK_ARCHITECTURE.md](./CDK_ARCHITECTURE.md)
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## Next Steps

1. Update Lambda handlers with actual use case implementations
2. Implement JWT authentication
3. Setup monitoring and alarms
4. Configure custom domain
5. Setup CI/CD pipeline
